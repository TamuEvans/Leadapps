import { storage } from '../storage';

/**
 * Clean up expired sessions from the database
 */
export async function cleanupExpiredSessions(): Promise<void> {
  try {
    const now = new Date();
    
    // Get all expired sessions
    const expiredSessions = await storage.getExpiredSessions(now);
    
    // Delete expired sessions
    for (const session of expiredSessions) {
      await storage.deleteSession(session.token);
    }
    
    console.log(`Cleaned up ${expiredSessions.length} expired sessions`);
  } catch (error) {
    console.error('Error cleaning up expired sessions:', error);
  }
}

/**
 * Schedule automatic session cleanup
 */
export function scheduleSessionCleanup(): void {
  // Clean up sessions every hour
  setInterval(() => {
    cleanupExpiredSessions();
  }, 60 * 60 * 1000); // 1 hour
  
  // Run initial cleanup
  cleanupExpiredSessions();
}