import express from 'express';
import { z } from 'zod';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { loginSchema, registerSchema } from '@shared/schema';
import { storage } from '../storage';
import { requireAuth } from './authMiddleware';

const router = express.Router();

// Get current user
router.get('/me', requireAuth, async (req, res) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({ message: 'Not authenticated' });
    }
    
    const user = await storage.getUser(userId);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Don't return sensitive information
    const { password, ...safeUser } = user as any;
    
    res.json(safeUser);
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const { email, password, firstName, lastName } = validationResult.data;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user
    const user = await storage.createUser({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      username: null,
      profileImageUrl: null,
      googleId: null,
      facebookId: null,
      isVerified: false,
      updatedAt: null
    });
    
    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    // Store token in session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await storage.createSession(user.id, token, expiresAt);
    
    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user as any;
    
    res.status(201).json({
      message: 'User registered successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Validate request body
    const validationResult = loginSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({ 
        message: 'Validation error', 
        errors: validationResult.error.format() 
      });
    }
    
    const { email, password } = validationResult.data;
    
    // Find user
    const user = await storage.getUserByEmail(email);
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Check password
    const isPasswordValid = await bcrypt.compare(password, user.password as string);
    
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate token
    const token = jwt.sign(
      { id: user.id },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '7d' }
    );
    
    // Store token in session
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7);
    await storage.createSession(user.id, token, expiresAt);
    
    // Set cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });
    
    // Return user data (excluding password)
    const { password: _, ...userWithoutPassword } = user as any;
    
    res.json({
      message: 'Logged in successfully',
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Logout user
router.post('/logout', requireAuth, async (req, res) => {
  try {
    const token = req.cookies?.auth_token;
    
    if (token) {
      // Delete session
      await storage.deleteSession(token);
      
      // Clear cookie
      res.clearCookie('auth_token');
    }
    
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Error logging out:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Google login
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

// Google callback
router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/app/profile');
  }
);

// Facebook login
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

// Facebook callback
router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect('/app/profile');
  }
);

// Forgot password - request password reset
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }
    
    // Check if user exists
    const user = await storage.getUserByEmail(email);
    if (!user) {
      // Don't reveal if email exists for security
      return res.json({ message: 'If an account with this email exists, we have sent password reset instructions.' });
    }
    
    // Generate reset token
    const resetToken = require('crypto').randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000); // 1 hour
    
    await storage.createPasswordReset(email, resetToken, expiresAt);
    
    // In a real app, you would send an email here
    // For now, we'll just return success
    console.log(`Password reset token for ${email}: ${resetToken}`);
    
    res.json({ 
      message: 'If an account with this email exists, we have sent password reset instructions.',
      // For development only - remove in production
      resetToken: process.env.NODE_ENV === 'development' ? resetToken : undefined
    });
  } catch (error) {
    console.error('Error requesting password reset:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify reset token
router.post('/verify-reset-token', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    const reset = await storage.getPasswordReset(token);
    
    if (!reset || reset.used || new Date() > reset.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    res.json({ message: 'Token is valid' });
  } catch (error) {
    console.error('Error verifying reset token:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Reset password
router.post('/reset-password', async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({ message: 'Token and password are required' });
    }
    
    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }
    
    const reset = await storage.getPasswordReset(token);
    
    if (!reset || reset.used || new Date() > reset.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Update user password
    const user = await storage.getUserByEmail(reset.email);
    if (user) {
      await storage.updateUser(user.id, { password: hashedPassword });
    }
    
    // Mark reset token as used
    await storage.markPasswordResetUsed(token);
    
    res.json({ message: 'Password reset successfully' });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Email verification
router.post('/verify-email', async (req, res) => {
  try {
    const { token } = req.body;
    
    if (!token) {
      return res.status(400).json({ message: 'Token is required' });
    }
    
    const verification = await storage.getEmailVerification(token);
    
    if (!verification || verification.verified || new Date() > verification.expiresAt) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }
    
    await storage.markEmailVerified(token);
    
    res.json({ message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Change password for authenticated users
router.post('/change-password', requireAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user?.id;
    
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ message: 'Current password and new password are required' });
    }
    
    if (newPassword.length < 8) {
      return res.status(400).json({ message: 'New password must be at least 8 characters long' });
    }
    
    const user = await storage.getUser(userId);
    if (!user || !user.password) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    
    // Update password
    await storage.updateUser(userId, { password: hashedPassword });
    
    res.json({ message: 'Password changed successfully' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;