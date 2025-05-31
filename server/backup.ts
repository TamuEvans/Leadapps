import { db } from './db';
import { users, studentProfiles, applications } from '@shared/schema';
import { logAuditEvent } from './auditLog';
import * as fs from 'fs';
import * as path from 'path';

export interface BackupConfig {
  includePersonalData: boolean;
  anonymizeData: boolean;
  retention: number; // days
}

export interface BackupMetadata {
  timestamp: Date;
  version: string;
  config: BackupConfig;
  recordCounts: Record<string, number>;
  checksum: string;
}

class BackupService {
  private backupDirectory: string;

  constructor() {
    this.backupDirectory = path.join(process.cwd(), 'backups');
    this.ensureBackupDirectory();
  }

  private ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDirectory)) {
      fs.mkdirSync(this.backupDirectory, { recursive: true });
    }
  }

  async createBackup(config: BackupConfig): Promise<string> {
    const timestamp = new Date();
    const backupId = `backup_${timestamp.toISOString().replace(/[:.]/g, '-')}`;
    const backupPath = path.join(this.backupDirectory, `${backupId}.json`);

    try {
      // Collect data from all tables
      const userData = await db.select().from(users);
      const profileData = await db.select().from(studentProfiles);
      const applicationData = await db.select().from(applications);

      // Process data based on configuration
      const processedData = {
        users: config.includePersonalData 
          ? (config.anonymizeData ? this.anonymizeUsers(userData) : userData)
          : [],
        profiles: config.includePersonalData 
          ? (config.anonymizeData ? this.anonymizeProfiles(profileData) : profileData)
          : [],
        applications: applicationData, // Applications typically need to be retained
      };

      // Create backup metadata
      const metadata: BackupMetadata = {
        timestamp,
        version: '1.0',
        config,
        recordCounts: {
          users: processedData.users.length,
          profiles: processedData.profiles.length,
          applications: processedData.applications.length,
        },
        checksum: this.calculateChecksum(processedData),
      };

      const backupContent = {
        metadata,
        data: processedData,
      };

      // Write backup file
      fs.writeFileSync(backupPath, JSON.stringify(backupContent, null, 2));

      // Log backup creation
      await logAuditEvent({
        action: 'BACKUP_CREATED',
        resource: 'database',
        resourceId: backupId,
        metadata: {
          recordCounts: metadata.recordCounts,
          config,
        },
      });

      return backupId;
    } catch (error) {
      console.error('Backup creation failed:', error);
      throw new Error('Failed to create backup');
    }
  }

  private anonymizeUsers(users: any[]) {
    return users.map(user => ({
      ...user,
      email: this.anonymizeEmail(user.email),
      firstName: this.anonymizeName(user.firstName || ''),
      lastName: this.anonymizeName(user.lastName || ''),
      password: '[REDACTED]',
      googleId: user.googleId ? '[REDACTED]' : null,
      facebookId: user.facebookId ? '[REDACTED]' : null,
    }));
  }

  private anonymizeProfiles(profiles: any[]) {
    return profiles.map(profile => ({
      ...profile,
      firstName: this.anonymizeName(profile.firstName || ''),
      middleName: this.anonymizeName(profile.middleName || ''),
      lastName: this.anonymizeName(profile.lastName || ''),
      dateOfBirth: profile.dateOfBirth ? '[REDACTED]' : null,
      passportNumber: profile.passportNumber ? '[REDACTED]' : null,
      phoneNumber: profile.phoneNumber ? '[REDACTED]' : null,
      address1: profile.address1 ? '[REDACTED]' : null,
      address2: profile.address2 ? '[REDACTED]' : null,
    }));
  }

  private anonymizeEmail(email: string): string {
    if (!email) return '';
    const [local, domain] = email.split('@');
    const anonymizedLocal = local.substring(0, 2) + '*'.repeat(Math.max(0, local.length - 4)) + local.substring(local.length - 2);
    return `${anonymizedLocal}@${domain}`;
  }

  private anonymizeName(name: string): string {
    if (!name || name.length <= 2) return '*'.repeat(name.length);
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }

  private calculateChecksum(data: any): string {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
  }

  async restoreBackup(backupId: string): Promise<boolean> {
    const backupPath = path.join(this.backupDirectory, `${backupId}.json`);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error('Backup file not found');
    }

    try {
      const backupContent = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      const { metadata, data } = backupContent;

      // Verify checksum
      const currentChecksum = this.calculateChecksum(data);
      if (currentChecksum !== metadata.checksum) {
        throw new Error('Backup file integrity check failed');
      }

      // Log restore operation
      await logAuditEvent({
        action: 'BACKUP_RESTORE_STARTED',
        resource: 'database',
        resourceId: backupId,
        metadata: metadata,
      });

      // Note: Actual restoration would require careful implementation
      // to avoid data conflicts and ensure referential integrity
      console.log('Backup restore would begin here:', metadata);
      
      return true;
    } catch (error) {
      console.error('Backup restoration failed:', error);
      throw error;
    }
  }

  listBackups(): string[] {
    const files = fs.readdirSync(this.backupDirectory);
    return files
      .filter(file => file.startsWith('backup_') && file.endsWith('.json'))
      .map(file => file.replace('.json', ''))
      .sort()
      .reverse(); // Most recent first
  }

  async cleanupOldBackups(retentionDays: number = 30): Promise<void> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - retentionDays);

    const backups = this.listBackups();
    let deletedCount = 0;

    for (const backupId of backups) {
      const backupPath = path.join(this.backupDirectory, `${backupId}.json`);
      const stats = fs.statSync(backupPath);
      
      if (stats.mtime < cutoffDate) {
        fs.unlinkSync(backupPath);
        deletedCount++;
      }
    }

    if (deletedCount > 0) {
      await logAuditEvent({
        action: 'BACKUP_CLEANUP',
        resource: 'filesystem',
        metadata: { deletedCount, retentionDays },
      });
    }
  }

  async scheduleRegularBackups(): Promise<void> {
    // Create daily backups with anonymized data
    const config: BackupConfig = {
      includePersonalData: true,
      anonymizeData: true,
      retention: 30,
    };

    try {
      await this.createBackup(config);
      await this.cleanupOldBackups(config.retention);
    } catch (error) {
      console.error('Scheduled backup failed:', error);
    }
  }
}

export const backupService = new BackupService();

// Schedule regular backups (would be called from a cron job in production)
export function setupBackupSchedule(): void {
  const DAILY_BACKUP_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours
  
  setInterval(() => {
    backupService.scheduleRegularBackups();
  }, DAILY_BACKUP_INTERVAL);
  
  console.log('Backup schedule initialized - daily backups enabled');
}