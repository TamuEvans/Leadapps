import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { getJWTSecret } from '../middleware/sessionSecret';

// Admin user interface
interface AdminUser {
  id: string;
  email: string;
  role: 'admin' | 'super_admin';
  permissions: string[];
}

// Demo admin credentials - Replace with database in production
const DEMO_ADMIN = {
  email: 'admin@leadapps.com',
  password: '$2a$12$LQv3c1yqBwEHXk.JHXuyY.qG6yGbE7EkZXeWaF1l4ZwCh3P4gAGh2', // "admin123"
  role: 'admin' as const,
  permissions: ['read_applications', 'write_applications', 'manage_users']
};

/**
 * Admin login endpoint
 */
export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }
    
    // Check against demo admin (replace with database lookup in production)
    if (email !== DEMO_ADMIN.email) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isValidPassword = await bcrypt.compare(password, DEMO_ADMIN.password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: 'admin-1',
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role,
        permissions: DEMO_ADMIN.permissions
      },
      getJWTSecret(),
      { expiresIn: '8h' }
    );
    
    // Set secure cookie
    const cookieOptions = {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict' as const,
      maxAge: 8 * 60 * 60 * 1000 // 8 hours
    };
    
    res.cookie('admin_token', token, cookieOptions);
    
    res.json({
      message: 'Admin login successful',
      admin: {
        id: 'admin-1',
        email: DEMO_ADMIN.email,
        role: DEMO_ADMIN.role,
        permissions: DEMO_ADMIN.permissions
      }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ message: 'Login failed' });
  }
}

/**
 * Admin authentication middleware
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  try {
    const token = req.cookies?.admin_token;
    
    if (!token) {
      return res.status(401).json({ message: 'Admin authentication required' });
    }
    
    const decoded = jwt.verify(token, getJWTSecret()) as any;
    
    if (!decoded.role || !['admin', 'super_admin'].includes(decoded.role)) {
      return res.status(403).json({ message: 'Admin access required' });
    }
    
    // Add admin info to request
    req.admin = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
      permissions: decoded.permissions || []
    };
    
    next();
  } catch (error) {
    res.clearCookie('admin_token');
    res.status(401).json({ message: 'Invalid admin token' });
  }
}

/**
 * Admin logout
 */
export function adminLogout(req: Request, res: Response) {
  res.clearCookie('admin_token');
  res.json({ message: 'Admin logged out successfully' });
}

// Extend Express Request type
declare global {
  namespace Express {
    interface Request {
      admin?: AdminUser;
    }
  }
}