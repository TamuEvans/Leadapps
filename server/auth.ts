import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { storage } from './storage';

// JWT secret key - in production this should be from environment variables
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-here';

export interface AuthToken {
  token: string;
  expiresAt: Date;
}

export interface AuthUser {
  id: number;
  email: string;
  firstName: string | null;
  lastName: string | null;
  isVerified: boolean;
}

export class AuthService {
  // Register a new user
  async register(email: string, password: string, firstName: string, lastName: string): Promise<{ user: AuthUser; needsVerification: boolean }> {
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      isVerified: false
    });

    // Generate email verification token
    const verificationToken = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    await storage.createEmailVerification(user.id, verificationToken, expiresAt);

    // Create student profile
    await storage.createStudentProfile({
      userId: user.id,
      firstName,
      lastName
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified || false
      },
      needsVerification: true
    };
  }

  // Login user
  async login(email: string, password: string, rememberMe = false): Promise<{ user: AuthUser; token: string }> {
    // Find user by email
    const user = await storage.getUserByEmail(email);
    if (!user || !user.password) {
      throw new Error('Invalid email or password');
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid email or password');
    }

    // Generate JWT token
    const tokenExpiry = rememberMe ? '30d' : '7d';
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: tokenExpiry }
    );

    // Create session
    const expiresAt = new Date(Date.now() + (rememberMe ? 30 : 7) * 24 * 60 * 60 * 1000);
    await storage.createSession(user.id, token, expiresAt);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified || false
      },
      token
    };
  }

  // Verify JWT token
  async verifyToken(token: string): Promise<AuthUser | null> {
    try {
      const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; email: string };
      
      // Check if session exists and is valid
      const session = await storage.getSessionByToken(token);
      if (!session || new Date() > session.expiresAt) {
        return null;
      }

      // Get user
      const user = await storage.getUser(decoded.userId);
      if (!user) {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        isVerified: user.isVerified || false
      };
    } catch (error) {
      return null;
    }
  }

  // Logout user
  async logout(token: string): Promise<void> {
    await storage.deleteSession(token);
  }

  // Request password reset
  async requestPasswordReset(email: string): Promise<{ resetToken: string }> {
    const user = await storage.getUserByEmail(email);
    if (!user) {
      throw new Error('No user found with this email address');
    }

    const resetToken = this.generateSecureToken();
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await storage.createPasswordReset(email, resetToken, expiresAt);

    return { resetToken };
  }

  // Reset password
  async resetPassword(token: string, newPassword: string): Promise<void> {
    const reset = await storage.getPasswordReset(token);
    if (!reset || reset.used || new Date() > reset.expiresAt) {
      throw new Error('Invalid or expired reset token');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update user password
    const user = await storage.getUserByEmail(reset.email);
    if (user) {
      await storage.updateUser(user.id, { password: hashedPassword });
    }

    // Mark reset token as used
    await storage.markPasswordResetUsed(token);
  }

  // Verify email
  async verifyEmail(token: string): Promise<void> {
    const verification = await storage.getEmailVerification(token);
    if (!verification || verification.verified || new Date() > verification.expiresAt) {
      throw new Error('Invalid or expired verification token');
    }

    await storage.markEmailVerified(token);
  }

  // Change password
  async changePassword(userId: number, currentPassword: string, newPassword: string): Promise<void> {
    const user = await storage.getUser(userId);
    if (!user || !user.password) {
      throw new Error('User not found');
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      throw new Error('Current password is incorrect');
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await storage.updateUser(userId, { password: hashedPassword });
  }

  // Generate secure random token
  private generateSecureToken(): string {
    return randomBytes(32).toString('hex');
  }
}

export const authService = new AuthService();