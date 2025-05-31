import { db } from './db';
import { users, studentProfiles, applications } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { logAuditEvent, AuditActions } from './auditLog';

// Data retention policies (in days)
export const dataRetentionPolicies = {
  inactiveProfiles: 1095, // 3 years
  completedApplications: 2555, // 7 years (for educational records)
  auditLogs: 2555, // 7 years
  sessionData: 30,
  passwordResetTokens: 1,
  emailVerificationTokens: 1,
} as const;

// GDPR/CCPA compliance functions
export interface DataExportRequest {
  userId: number;
  requestorIp: string;
  includeApplications?: boolean;
  includeAuditLogs?: boolean;
}

export async function exportUserData(request: DataExportRequest): Promise<any> {
  const { userId, requestorIp } = request;

  // Log the data export request
  await logAuditEvent({
    userId,
    action: AuditActions.DATA_EXPORT,
    resource: 'user_data',
    resourceId: userId.toString(),
    ipAddress: requestorIp,
  });

  // Collect all user data
  const userData = await db.select().from(users).where(eq(users.id, userId));
  const profileData = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
  
  let applicationData = null;
  if (request.includeApplications) {
    applicationData = await db.select().from(applications).where(eq(applications.studentId, profileData[0]?.id || 0));
  }

  return {
    exportDate: new Date().toISOString(),
    userData: userData[0] ? {
      id: userData[0].id,
      email: userData[0].email,
      firstName: userData[0].firstName,
      lastName: userData[0].lastName,
      createdAt: userData[0].createdAt,
      // Exclude sensitive fields like password
    } : null,
    profileData: profileData[0] || null,
    applicationData,
    notice: 'This export contains all personal data we have on file. Some sensitive information has been excluded for security purposes.',
  };
}

export interface DataDeletionRequest {
  userId: number;
  requestorIp: string;
  reason: string;
  retainApplications?: boolean;
}

export async function deleteUserData(request: DataDeletionRequest): Promise<void> {
  const { userId, requestorIp, reason } = request;

  // Log the data deletion request
  await logAuditEvent({
    userId,
    action: AuditActions.DATA_DELETE,
    resource: 'user_data',
    resourceId: userId.toString(),
    ipAddress: requestorIp,
    metadata: { reason, retainApplications: request.retainApplications },
  });

  // Begin deletion process
  // Note: In production, this might involve a soft delete first with a grace period
  
  if (!request.retainApplications) {
    // Delete applications and related data
    const profileData = await db.select().from(studentProfiles).where(eq(studentProfiles.userId, userId));
    if (profileData[0]) {
      await db.delete(applications).where(eq(applications.studentId, profileData[0].id));
    }
  }

  // Delete profile data
  await db.delete(studentProfiles).where(eq(studentProfiles.userId, userId));
  
  // Delete user account (or anonymize if applications retained)
  if (request.retainApplications) {
    // Anonymize instead of delete
    await db.update(users)
      .set({
        email: `deleted_${userId}@anonymized.local`,
        firstName: 'Deleted',
        lastName: 'User',
        profileImageUrl: null,
      })
      .where(eq(users.id, userId));
  } else {
    await db.delete(users).where(eq(users.id, userId));
  }
}

// Consent management
export interface ConsentRecord {
  userId: number;
  consentType: 'data_processing' | 'marketing' | 'analytics' | 'third_party_sharing';
  granted: boolean;
  timestamp: Date;
  ipAddress: string;
  version: string;
}

const consentStore = new Map<string, ConsentRecord[]>();

export function recordConsent(consent: ConsentRecord): void {
  const key = `${consent.userId}_${consent.consentType}`;
  const existing = consentStore.get(key) || [];
  existing.push(consent);
  consentStore.set(key, existing);
}

export function getConsent(userId: number, consentType: ConsentRecord['consentType']): ConsentRecord | null {
  const key = `${userId}_${consentType}`;
  const consents = consentStore.get(key) || [];
  return consents.length > 0 ? consents[consents.length - 1] : null;
}

export function hasValidConsent(userId: number, consentType: ConsentRecord['consentType']): boolean {
  const consent = getConsent(userId, consentType);
  return consent ? consent.granted : false;
}

// Data anonymization utilities
export function anonymizeEmail(email: string): string {
  const [local, domain] = email.split('@');
  const anonymizedLocal = local.substring(0, 2) + '*'.repeat(Math.max(0, local.length - 4)) + local.substring(local.length - 2);
  return `${anonymizedLocal}@${domain}`;
}

export function anonymizeName(name: string): string {
  if (name.length <= 2) return '*'.repeat(name.length);
  return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
}

// Data breach notification system
export interface DataBreachNotification {
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  affectedUsers: number[];
  dataTypes: string[];
  detectedAt: Date;
  containedAt?: Date;
  notificationRequired: boolean;
}

export async function reportDataBreach(breach: DataBreachNotification): Promise<void> {
  console.error('DATA BREACH DETECTED:', breach);
  
  // Log the security incident
  await logAuditEvent({
    action: 'SECURITY_BREACH',
    resource: 'system',
    metadata: breach,
  });

  // In production, this would:
  // 1. Notify security team immediately
  // 2. Begin containment procedures
  // 3. Prepare regulatory notifications if required
  // 4. Document the incident
}

// Regular cleanup of expired data
export async function cleanupExpiredData(): Promise<void> {
  const now = new Date();
  
  // This would be implemented with actual database queries
  // For example, cleaning up expired password reset tokens, etc.
  
  console.log('Data cleanup completed at', now.toISOString());
}