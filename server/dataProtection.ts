import { db } from './db';
import { users, studentProfiles } from '@shared/schema';
import { eq } from 'drizzle-orm';
import { logAuditEvent, AuditActions } from './auditLog';
import crypto from 'crypto';

// Data encryption utilities
export class DataProtection {
  private readonly ENCRYPTION_KEY: string;
  private readonly ALGORITHM = 'aes-256-gcm';

  constructor() {
    this.ENCRYPTION_KEY = process.env.DATA_ENCRYPTION_KEY || this.generateKey();
    if (!process.env.DATA_ENCRYPTION_KEY) {
      console.warn('DATA_ENCRYPTION_KEY not set. Using generated key (data will not persist across restarts)');
    }
  }

  private generateKey(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  // Encrypt sensitive data
  encrypt(text: string): string {
    if (!text) return text;
    
    const iv = crypto.randomBytes(16);
    const cipher = crypto.createCipher(this.ALGORITHM, this.ENCRYPTION_KEY);
    
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return iv.toString('hex') + ':' + encrypted;
  }

  // Decrypt sensitive data
  decrypt(encryptedText: string): string {
    if (!encryptedText || !encryptedText.includes(':')) return encryptedText;
    
    try {
      const [ivHex, encrypted] = encryptedText.split(':');
      const decipher = crypto.createDecipher(this.ALGORITHM, this.ENCRYPTION_KEY);
      
      let decrypted = decipher.update(encrypted, 'hex', 'utf8');
      decrypted += decipher.final('utf8');
      
      return decrypted;
    } catch (error) {
      console.error('Decryption failed:', error);
      return encryptedText; // Return original if decryption fails
    }
  }

  // Hash sensitive identifiers
  hashIdentifier(identifier: string): string {
    return crypto.createHash('sha256').update(identifier + this.ENCRYPTION_KEY).digest('hex');
  }

  // Validate data integrity
  validateDataIntegrity(data: any, expectedHash?: string): boolean {
    if (!expectedHash) return true;
    
    const currentHash = crypto.createHash('sha256').update(JSON.stringify(data)).digest('hex');
    return currentHash === expectedHash;
  }

  // Secure data deletion
  async secureDelete(userId: number, reason: string, ipAddress: string): Promise<void> {
    await logAuditEvent({
      userId,
      action: AuditActions.DATA_DELETE,
      resource: 'user_data',
      resourceId: userId.toString(),
      ipAddress,
      metadata: { reason, timestamp: new Date().toISOString() },
    });

    // Multiple pass deletion for sensitive data
    await this.multiPassDelete(userId);
  }

  private async multiPassDelete(userId: number): Promise<void> {
    // First pass: overwrite with random data
    const randomData = {
      email: crypto.randomBytes(16).toString('hex') + '@deleted.local',
      firstName: crypto.randomBytes(8).toString('hex'),
      lastName: crypto.randomBytes(8).toString('hex'),
      password: crypto.randomBytes(32).toString('hex'),
    };

    await db.update(users)
      .set(randomData)
      .where(eq(users.id, userId));

    // Second pass: delete the record
    await db.delete(users).where(eq(users.id, userId));
  }
}

// Data masking for non-production environments
export class DataMasking {
  static maskEmail(email: string): string {
    if (!email || !email.includes('@')) return email;
    
    const [local, domain] = email.split('@');
    const maskedLocal = local.substring(0, 2) + '*'.repeat(Math.max(0, local.length - 4)) + local.substring(local.length - 2);
    return `${maskedLocal}@${domain}`;
  }

  static maskPhoneNumber(phone: string): string {
    if (!phone) return phone;
    
    const cleaned = phone.replace(/\D/g, '');
    if (cleaned.length < 6) return phone;
    
    return cleaned.substring(0, 3) + '*'.repeat(cleaned.length - 6) + cleaned.substring(cleaned.length - 3);
  }

  static maskName(name: string): string {
    if (!name || name.length <= 2) return '*'.repeat(name.length);
    return name.charAt(0) + '*'.repeat(name.length - 2) + name.charAt(name.length - 1);
  }

  static maskPassportNumber(passport: string): string {
    if (!passport) return passport;
    return passport.substring(0, 2) + '*'.repeat(Math.max(0, passport.length - 4)) + passport.substring(passport.length - 2);
  }

  static maskCreditCard(cardNumber: string): string {
    if (!cardNumber) return cardNumber;
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 8) return cardNumber;
    
    return '*'.repeat(cleaned.length - 4) + cleaned.substring(cleaned.length - 4);
  }
}

// Data validation and sanitization
export class DataValidator {
  static sanitizeInput(input: string): string {
    if (!input) return input;
    
    return input
      .trim()
      .replace(/[<>]/g, '') // Remove potential XSS characters
      .replace(/\\/g, '') // Remove backslashes
      .substring(0, 1000); // Limit length
  }

  static validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  static validatePhoneNumber(phone: string): boolean {
    const phoneRegex = /^\+?[\d\s\-\(\)]{10,}$/;
    return phoneRegex.test(phone);
  }

  static validatePassportNumber(passport: string): boolean {
    // Basic passport validation - 6-9 alphanumeric characters
    const passportRegex = /^[A-Z0-9]{6,9}$/;
    return passportRegex.test(passport.toUpperCase());
  }

  static validateDate(dateString: string): boolean {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) && date < new Date();
  }

  static validateAge(birthDate: string, minAge: number = 13): boolean {
    const birth = new Date(birthDate);
    const today = new Date();
    const age = today.getFullYear() - birth.getFullYear();
    
    return age >= minAge;
  }
}

// PII detection and handling
export class PIIDetector {
  private static readonly SSN_REGEX = /\b\d{3}-?\d{2}-?\d{4}\b/g;
  private static readonly CREDIT_CARD_REGEX = /\b\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}\b/g;
  private static readonly PHONE_REGEX = /\b\d{3}[\s-]?\d{3}[\s-]?\d{4}\b/g;
  private static readonly EMAIL_REGEX = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;

  static detectPII(text: string): {
    hasPII: boolean;
    types: string[];
    redactedText: string;
  } {
    let hasPII = false;
    const types: string[] = [];
    let redactedText = text;

    if (this.SSN_REGEX.test(text)) {
      hasPII = true;
      types.push('SSN');
      redactedText = redactedText.replace(this.SSN_REGEX, '[REDACTED-SSN]');
    }

    if (this.CREDIT_CARD_REGEX.test(text)) {
      hasPII = true;
      types.push('CREDIT_CARD');
      redactedText = redactedText.replace(this.CREDIT_CARD_REGEX, '[REDACTED-CC]');
    }

    if (this.PHONE_REGEX.test(text)) {
      hasPII = true;
      types.push('PHONE');
      redactedText = redactedText.replace(this.PHONE_REGEX, '[REDACTED-PHONE]');
    }

    if (this.EMAIL_REGEX.test(text)) {
      hasPII = true;
      types.push('EMAIL');
      redactedText = redactedText.replace(this.EMAIL_REGEX, '[REDACTED-EMAIL]');
    }

    return { hasPII, types, redactedText };
  }

  static async logPIIDetection(userId: number, content: string, context: string): Promise<void> {
    const detection = this.detectPII(content);
    
    if (detection.hasPII) {
      await logAuditEvent({
        userId,
        action: 'PII_DETECTED',
        resource: context,
        metadata: {
          piiTypes: detection.types,
          contentLength: content.length,
          detectionTime: new Date().toISOString(),
        },
      });
    }
  }
}

export const dataProtection = new DataProtection();