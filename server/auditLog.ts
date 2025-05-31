import { db } from './db';
import { pgTable, serial, text, timestamp, integer, jsonb } from 'drizzle-orm/pg-core';

// Audit log table for security and compliance
export const auditLogs = pgTable("audit_logs", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  action: text("action").notNull(),
  resource: text("resource").notNull(),
  resourceId: text("resource_id"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  metadata: jsonb("metadata"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
});

export type AuditLog = typeof auditLogs.$inferSelect;

export interface AuditLogEntry {
  userId?: number;
  action: string;
  resource: string;
  resourceId?: string;
  ipAddress?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(entry: AuditLogEntry): Promise<void> {
  try {
    await db.insert(auditLogs).values({
      userId: entry.userId,
      action: entry.action,
      resource: entry.resource,
      resourceId: entry.resourceId,
      ipAddress: entry.ipAddress,
      userAgent: entry.userAgent,
      metadata: entry.metadata,
    });
  } catch (error) {
    console.error('Failed to log audit event:', error);
    // Don't throw here - audit logging shouldn't break application flow
  }
}

// Helper functions for common audit events
export const AuditActions = {
  USER_LOGIN: 'USER_LOGIN',
  USER_LOGOUT: 'USER_LOGOUT',
  USER_REGISTER: 'USER_REGISTER',
  PASSWORD_RESET_REQUEST: 'PASSWORD_RESET_REQUEST',
  PASSWORD_RESET_COMPLETE: 'PASSWORD_RESET_COMPLETE',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  DOCUMENT_UPLOAD: 'DOCUMENT_UPLOAD',
  APPLICATION_SUBMIT: 'APPLICATION_SUBMIT',
  DATA_EXPORT: 'DATA_EXPORT',
  DATA_DELETE: 'DATA_DELETE',
  FAILED_LOGIN: 'FAILED_LOGIN',
  SECURITY_VIOLATION: 'SECURITY_VIOLATION',
} as const;

export async function logUserLogin(userId: number, ipAddress: string, userAgent: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: AuditActions.USER_LOGIN,
    resource: 'auth',
    ipAddress,
    userAgent,
  });
}

export async function logFailedLogin(email: string, ipAddress: string, userAgent: string): Promise<void> {
  await logAuditEvent({
    action: AuditActions.FAILED_LOGIN,
    resource: 'auth',
    ipAddress,
    userAgent,
    metadata: { email },
  });
}

export async function logDataAccess(userId: number, resource: string, resourceId: string, ipAddress: string): Promise<void> {
  await logAuditEvent({
    userId,
    action: 'DATA_ACCESS',
    resource,
    resourceId,
    ipAddress,
  });
}