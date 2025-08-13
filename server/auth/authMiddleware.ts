import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { User } from '../../shared/schema';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: User;
      token?: string;
    }
  }
}

/**
 * Authentication middleware that verifies JWT token and attaches user to request
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Get token from cookie
  const token = req.cookies?.auth_token;
  
  if (!token) {
    return next();
  }
  
  try {
    // Import authService dynamically to avoid circular imports
    const { authService } = await import('../auth');
    
    // Use authService to verify token
    const user = await authService.verifyToken(token);
    
    if (user) {
      // Attach user and token to request
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Invalid token, clear cookie and continue
    res.clearCookie('auth_token');
  }
  
  next();
};

/**
 * Protected route middleware - requires authentication
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Not authenticated' });
  }
  
  next();
};

/**
 * Guest only middleware - requires no authentication
 */
export const guestOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user) {
    return res.status(403).json({ message: 'Already authenticated' });
  }
  
  next();
};