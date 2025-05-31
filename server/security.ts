import bcrypt from 'bcryptjs';
import crypto from 'crypto';
import { Request } from 'express';

// Password security configuration
export const passwordConfig = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumbers: true,
  requireSpecialChars: true,
  saltRounds: 12,
};

// Common passwords to reject
const commonPasswords = [
  'password', '123456', '123456789', 'qwerty', 'abc123',
  'password123', 'admin', 'letmein', 'welcome', 'monkey'
];

export function validatePasswordStrength(password: string): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (password.length < passwordConfig.minLength) {
    errors.push(`Password must be at least ${passwordConfig.minLength} characters long`);
  }

  if (password.length > passwordConfig.maxLength) {
    errors.push(`Password must be no more than ${passwordConfig.maxLength} characters long`);
  }

  if (passwordConfig.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }

  if (passwordConfig.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (passwordConfig.requireNumbers && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  if (passwordConfig.requireSpecialChars && !/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  if (commonPasswords.includes(password.toLowerCase())) {
    errors.push('Password is too common, please choose a more secure password');
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, passwordConfig.saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

// Generate secure tokens
export function generateSecureToken(length: number = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

// IP address extraction
export function getClientIpAddress(req: Request): string {
  const forwarded = req.headers['x-forwarded-for'] as string;
  const realIp = req.headers['x-real-ip'] as string;
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIp) {
    return realIp;
  }
  
  return req.socket.remoteAddress || 'unknown';
}

// User agent parsing
export function getUserAgent(req: Request): string {
  return req.headers['user-agent'] || 'unknown';
}

// Session security
export function generateSessionId(): string {
  return crypto.randomBytes(32).toString('hex');
}

// CSRF token generation
export function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('base64url');
}

// Data sanitization
export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, '');
}

export function sanitizeEmail(email: string): string {
  return email.toLowerCase().trim();
}

// File validation
export function isValidFileType(filename: string, allowedTypes: string[]): boolean {
  const extension = filename.toLowerCase().split('.').pop();
  return extension ? allowedTypes.includes(extension) : false;
}

// Rate limiting helpers
export interface RateLimitInfo {
  attempts: number;
  lastAttempt: Date;
  blockedUntil?: Date;
}

const rateLimitStore = new Map<string, RateLimitInfo>();

export function checkRateLimit(key: string, maxAttempts: number, windowMs: number): boolean {
  const now = new Date();
  const info = rateLimitStore.get(key);

  if (!info) {
    rateLimitStore.set(key, { attempts: 1, lastAttempt: now });
    return true;
  }

  // Check if blocked
  if (info.blockedUntil && now < info.blockedUntil) {
    return false;
  }

  // Reset if window expired
  if (now.getTime() - info.lastAttempt.getTime() > windowMs) {
    rateLimitStore.set(key, { attempts: 1, lastAttempt: now });
    return true;
  }

  // Increment attempts
  info.attempts++;
  info.lastAttempt = now;

  if (info.attempts > maxAttempts) {
    info.blockedUntil = new Date(now.getTime() + windowMs);
    return false;
  }

  return true;
}

export function clearRateLimit(key: string): void {
  rateLimitStore.delete(key);
}