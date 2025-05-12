import express from 'express';
import passport from 'passport';
import { z } from 'zod';
import { loginSchema, registerSchema } from '@shared/schema';
import { loginUser, registerUser, logoutUser } from './authService';
import { requireAuth, guestOnly } from './authMiddleware';

const router = express.Router();

// Register
router.post('/register', guestOnly, async (req, res) => {
  try {
    // Validate request body
    const validatedData = registerSchema.parse(req.body);
    
    // Register user
    const { user, token } = await registerUser(validatedData);
    
    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });
    
    // Return user (without sensitive info)
    const { password, ...userWithoutPassword } = user;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.format() 
      });
    }
    
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'An error occurred during registration' });
  }
});

// Login
router.post('/login', guestOnly, async (req, res) => {
  try {
    // Validate request body
    const validatedData = loginSchema.parse(req.body);
    
    // Login user
    const { user, token } = await loginUser(validatedData);
    
    // Set cookie
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: validatedData.rememberMe 
        ? 30 * 24 * 60 * 60 * 1000  // 30 days
        : 24 * 60 * 60 * 1000,      // 1 day
    });
    
    // Return user (without sensitive info)
    const { password, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: error.format() 
      });
    }
    
    if (error instanceof Error) {
      return res.status(400).json({ message: error.message });
    }
    
    res.status(500).json({ message: 'An error occurred during login' });
  }
});

// Google OAuth
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

// Google OAuth callback
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login?error=google-auth-failed');
    
    // Generate JWT token
    const token = user.token || '';
    
    // Set cookie and redirect
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.redirect('/');
  })(req, res, next);
});

// Facebook OAuth
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

// Facebook OAuth callback
router.get('/facebook/callback', (req, res, next) => {
  passport.authenticate('facebook', { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.redirect('/login?error=facebook-auth-failed');
    
    // Generate JWT token
    const token = user.token || '';
    
    // Set cookie and redirect
    res.cookie('authToken', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    
    res.redirect('/');
  })(req, res, next);
});

// Logout
router.post('/logout', requireAuth, async (req, res) => {
  try {
    if (req.token) {
      await logoutUser(req.token);
    }
    
    res.clearCookie('authToken');
    res.json({ message: 'Logged out successfully' });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ message: 'An error occurred during logout' });
  }
});

// Get current user
router.get('/me', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  // Return user without sensitive information
  const { password, ...userWithoutPassword } = req.user;
  res.json(userWithoutPassword);
});

export default router;