import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { User } from '@shared/schema';

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
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret') as { id: number };
    
    // Find user in database
    const user = await storage.getUser(decoded.id);
    
    if (user) {
      // Check if token is in sessions
      const session = await storage.getSessionByToken(token);
      
      if (!session) {
        return next();
      }
      
      // Check if session is expired
      const expiresAt = new Date(session.expiresAt);
      
      if (expiresAt < new Date()) {
        await storage.deleteSession(token);
        return next();
      }
      
      // Attach user and token to request
      req.user = user;
      req.token = token;
    }
  } catch (error) {
    // Invalid token, just continue
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