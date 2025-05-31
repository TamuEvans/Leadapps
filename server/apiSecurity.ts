import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getClientIpAddress, getUserAgent, checkRateLimit } from './security';
import { logAuditEvent, AuditActions } from './auditLog';
import { sessionManager } from './sessionManager';

export interface SecureRequest extends Request {
  user?: {
    id: number;
    email: string;
    isVerified: boolean;
  };
  ipAddress?: string;
  userAgent?: string;
}

// API Key validation middleware
export function validateApiKey(req: SecureRequest, res: Response, next: NextFunction): void {
  const apiKey = req.headers['x-api-key'] as string;
  
  if (!apiKey) {
    res.status(401).json({ error: 'API key required' });
    return;
  }

  // In production, validate against stored API keys
  const validApiKeys = process.env.API_KEYS?.split(',') || [];
  
  if (!validApiKeys.includes(apiKey)) {
    logAuditEvent({
      action: 'INVALID_API_KEY',
      resource: 'api',
      ipAddress: getClientIpAddress(req),
      userAgent: getUserAgent(req),
      metadata: { providedKey: apiKey.substring(0, 8) + '...' },
    });
    
    res.status(401).json({ error: 'Invalid API key' });
    return;
  }

  next();
}

// JWT Authentication middleware
export async function authenticateJWT(req: SecureRequest, res: Response, next: NextFunction): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.substring(7) : null;

  if (!token) {
    res.status(401).json({ error: 'Authentication token required' });
    return;
  }

  try {
    // Validate session
    const sessionResult = await sessionManager.validateSession(token);
    
    if (!sessionResult.valid || !sessionResult.userId) {
      res.status(401).json({ error: 'Invalid or expired token' });
      return;
    }

    // Add user info to request
    req.user = {
      id: sessionResult.userId,
      email: '', // Would be populated from user lookup
      isVerified: true,
    };
    
    req.ipAddress = getClientIpAddress(req);
    req.userAgent = getUserAgent(req);

    next();
  } catch (error) {
    res.status(401).json({ error: 'Token validation failed' });
  }
}

// Role-based access control
export function requireRole(roles: string[]) {
  return async (req: SecureRequest, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
      res.status(401).json({ error: 'Authentication required' });
      return;
    }

    // In production, check user roles from database
    const userRoles = ['user']; // Would be fetched from database
    
    const hasRequiredRole = roles.some(role => userRoles.includes(role));
    
    if (!hasRequiredRole) {
      await logAuditEvent({
        userId: req.user.id,
        action: AuditActions.SECURITY_VIOLATION,
        resource: req.path,
        ipAddress: req.ipAddress,
        metadata: { requiredRoles: roles, userRoles },
      });
      
      res.status(403).json({ error: 'Insufficient permissions' });
      return;
    }

    next();
  };
}

// Rate limiting with user-specific limits
export function userRateLimit(maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
    const key = req.user ? `user_${req.user.id}` : `ip_${getClientIpAddress(req)}`;
    
    if (!checkRateLimit(key, maxRequests, windowMs)) {
      res.status(429).json({ 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil(windowMs / 1000),
      });
      return;
    }

    next();
  };
}

// CSRF protection
export function csrfProtection(req: SecureRequest, res: Response, next: NextFunction): void {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    next();
    return;
  }

  const csrfToken = req.headers['x-csrf-token'] as string;
  const sessionCsrf = req.session?.csrfToken;

  if (!csrfToken || !sessionCsrf || csrfToken !== sessionCsrf) {
    logAuditEvent({
      userId: req.user?.id,
      action: 'CSRF_VIOLATION',
      resource: req.path,
      ipAddress: req.ipAddress,
      metadata: { method: req.method, hasToken: !!csrfToken },
    });
    
    res.status(403).json({ error: 'CSRF token validation failed' });
    return;
  }

  next();
}

// Input sanitization middleware
export function sanitizeInput(req: SecureRequest, res: Response, next: NextFunction): void {
  // Sanitize request body
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }

  // Sanitize query parameters
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
}

function sanitizeObject(obj: any): any {
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  
  if (obj !== null && typeof obj === 'object') {
    const sanitized: any = {};
    for (const [key, value] of Object.entries(obj)) {
      sanitized[key] = sanitizeObject(value);
    }
    return sanitized;
  }
  
  if (typeof obj === 'string') {
    return obj
      .trim()
      .replace(/[<>]/g, '') // Remove potential XSS
      .replace(/\\/g, '') // Remove backslashes
      .substring(0, 10000); // Limit length
  }
  
  return obj;
}

// Content-Type validation
export function validateContentType(allowedTypes: string[]) {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
    const contentType = req.headers['content-type'];
    
    if (!contentType || !allowedTypes.some(type => contentType.includes(type))) {
      res.status(415).json({ error: 'Unsupported content type' });
      return;
    }

    next();
  };
}

// Request size limitation
export function limitRequestSize(maxSize: number = 10 * 1024 * 1024) {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
    const contentLength = parseInt(req.headers['content-length'] || '0', 10);
    
    if (contentLength > maxSize) {
      res.status(413).json({ error: 'Request entity too large' });
      return;
    }

    next();
  };
}

// Geographic restriction (if needed)
export function restrictByGeography(allowedCountries: string[]) {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
    // In production, you would use a GeoIP service
    const country = req.headers['cf-ipcountry'] as string || 'UNKNOWN';
    
    if (!allowedCountries.includes(country)) {
      logAuditEvent({
        userId: req.user?.id,
        action: 'GEOGRAPHIC_RESTRICTION',
        resource: req.path,
        ipAddress: req.ipAddress,
        metadata: { country, allowedCountries },
      });
      
      res.status(403).json({ error: 'Access restricted from your location' });
      return;
    }

    next();
  };
}

// API versioning support
export function requireApiVersion(supportedVersions: string[]) {
  return (req: SecureRequest, res: Response, next: NextFunction): void => {
    const version = req.headers['api-version'] as string || '1.0';
    
    if (!supportedVersions.includes(version)) {
      res.status(400).json({ 
        error: 'Unsupported API version',
        supportedVersions,
      });
      return;
    }

    req.apiVersion = version;
    next();
  };
}