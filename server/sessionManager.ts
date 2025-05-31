import { db } from './db';
import { eq, and, lt } from 'drizzle-orm';
import { sessions } from '@shared/schema';
import { generateSecureToken } from './security';
import { logAuditEvent, AuditActions } from './auditLog';

export interface SessionData {
  id: number;
  userId: number;
  token: string;
  expiresAt: Date;
  createdAt: Date;
}

export class SessionManager {
  private readonly DEFAULT_SESSION_DURATION = 7 * 24 * 60 * 60 * 1000; // 7 days
  private readonly EXTENDED_SESSION_DURATION = 30 * 24 * 60 * 60 * 1000; // 30 days

  async createSession(userId: number, rememberMe: boolean = false, ipAddress?: string): Promise<string> {
    const token = generateSecureToken(32);
    const duration = rememberMe ? this.EXTENDED_SESSION_DURATION : this.DEFAULT_SESSION_DURATION;
    const expiresAt = new Date(Date.now() + duration);

    await db.insert(sessions).values({
      userId,
      token,
      expiresAt,
    });

    // Log session creation
    await logAuditEvent({
      userId,
      action: AuditActions.USER_LOGIN,
      resource: 'session',
      resourceId: token.substring(0, 8), // Log only partial token for security
      ipAddress,
      metadata: { rememberMe, duration },
    });

    return token;
  }

  async getSession(token: string): Promise<SessionData | null> {
    const [session] = await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.token, token),
        lt(new Date(), sessions.expiresAt)
      ));

    return session || null;
  }

  async validateSession(token: string): Promise<{ valid: boolean; userId?: number }> {
    const session = await this.getSession(token);
    
    if (!session) {
      return { valid: false };
    }

    // Check if session is expired
    if (new Date() > session.expiresAt) {
      await this.destroySession(token);
      return { valid: false };
    }

    return { valid: true, userId: session.userId };
  }

  async refreshSession(token: string, extendDuration: boolean = false): Promise<boolean> {
    const session = await this.getSession(token);
    
    if (!session) {
      return false;
    }

    const additionalTime = extendDuration ? this.EXTENDED_SESSION_DURATION : this.DEFAULT_SESSION_DURATION;
    const newExpiresAt = new Date(Date.now() + additionalTime);

    const [updated] = await db
      .update(sessions)
      .set({ expiresAt: newExpiresAt })
      .where(eq(sessions.token, token))
      .returning();

    return !!updated;
  }

  async destroySession(token: string, userId?: number, ipAddress?: string): Promise<boolean> {
    const [deleted] = await db
      .delete(sessions)
      .where(eq(sessions.token, token))
      .returning();

    if (deleted && userId) {
      await logAuditEvent({
        userId,
        action: AuditActions.USER_LOGOUT,
        resource: 'session',
        resourceId: token.substring(0, 8),
        ipAddress,
      });
    }

    return !!deleted;
  }

  async destroyAllUserSessions(userId: number, currentToken?: string): Promise<number> {
    let query = db.delete(sessions).where(eq(sessions.userId, userId));
    
    if (currentToken) {
      query = query.where(eq(sessions.token, currentToken));
    }

    const deleted = await query.returning();
    
    await logAuditEvent({
      userId,
      action: 'ALL_SESSIONS_DESTROYED',
      resource: 'session',
      metadata: { destroyedCount: deleted.length, keepCurrent: !!currentToken },
    });

    return deleted.length;
  }

  async cleanupExpiredSessions(): Promise<number> {
    const deleted = await db
      .delete(sessions)
      .where(lt(sessions.expiresAt, new Date()))
      .returning();

    if (deleted.length > 0) {
      await logAuditEvent({
        action: 'SESSION_CLEANUP',
        resource: 'session',
        metadata: { cleanedCount: deleted.length },
      });
    }

    return deleted.length;
  }

  async getUserActiveSessions(userId: number): Promise<SessionData[]> {
    return await db
      .select()
      .from(sessions)
      .where(and(
        eq(sessions.userId, userId),
        lt(new Date(), sessions.expiresAt)
      ));
  }

  async getSessionInfo(token: string): Promise<{
    isActive: boolean;
    expiresAt?: Date;
    userId?: number;
    timeRemaining?: number;
  }> {
    const session = await this.getSession(token);
    
    if (!session) {
      return { isActive: false };
    }

    const timeRemaining = session.expiresAt.getTime() - Date.now();
    
    return {
      isActive: timeRemaining > 0,
      expiresAt: session.expiresAt,
      userId: session.userId,
      timeRemaining: Math.max(0, timeRemaining),
    };
  }

  // Security method to detect concurrent sessions
  async detectConcurrentSessions(userId: number, maxAllowed: number = 5): Promise<{
    isViolation: boolean;
    activeCount: number;
    oldestSessions?: SessionData[];
  }> {
    const activeSessions = await this.getUserActiveSessions(userId);
    
    if (activeSessions.length <= maxAllowed) {
      return { isViolation: false, activeCount: activeSessions.length };
    }

    // Sort by creation date to find oldest sessions
    const sortedSessions = activeSessions.sort((a, b) => 
      a.createdAt.getTime() - b.createdAt.getTime()
    );

    const oldestSessions = sortedSessions.slice(0, activeSessions.length - maxAllowed);

    await logAuditEvent({
      userId,
      action: 'CONCURRENT_SESSION_VIOLATION',
      resource: 'session',
      metadata: {
        activeCount: activeSessions.length,
        maxAllowed,
        violationCount: oldestSessions.length,
      },
    });

    return {
      isViolation: true,
      activeCount: activeSessions.length,
      oldestSessions,
    };
  }

  // Method to automatically clean up excess sessions
  async enforceSessionLimit(userId: number, maxAllowed: number = 5): Promise<void> {
    const detection = await this.detectConcurrentSessions(userId, maxAllowed);
    
    if (detection.isViolation && detection.oldestSessions) {
      for (const session of detection.oldestSessions) {
        await this.destroySession(session.token, userId);
      }
    }
  }
}

export const sessionManager = new SessionManager();

// Schedule regular cleanup of expired sessions
export function scheduleSessionCleanup(): void {
  const CLEANUP_INTERVAL = 60 * 60 * 1000; // 1 hour
  
  setInterval(async () => {
    try {
      await sessionManager.cleanupExpiredSessions();
    } catch (error) {
      console.error('Session cleanup failed:', error);
    }
  }, CLEANUP_INTERVAL);
  
  console.log('Session cleanup scheduler initialized');
}