import { Request, Response, NextFunction } from 'express';
import { getCurrentUser } from './authService';

// Define an interface to extend Express.Request
declare global {
  namespace Express {
    interface Request {
      user?: any;
      token?: string;
    }
  }
}

/**
 * Authentication middleware that verifies JWT token and attaches user to request
 */
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Get token from cookies or Authorization header
    let token = req.cookies?.authToken;
    
    if (!token && req.headers.authorization) {
      const authHeader = req.headers.authorization;
      if (authHeader.startsWith('Bearer ')) {
        token = authHeader.substring(7);
      }
    }

    if (!token) {
      return next(); // No token, continue without user
    }

    // Verify token and get user
    const user = await getCurrentUser(token);
    
    if (user) {
      // Attach user and token to request
      req.user = user;
      req.token = token;
    }

    next();
  } catch (error) {
    // If any error, just proceed without authentication
    next();
  }
};

/**
 * Protected route middleware - requires authentication
 */
export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ message: 'Authentication required' });
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