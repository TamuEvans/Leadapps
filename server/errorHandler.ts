import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { logAuditEvent } from './auditLog';
import { getClientIpAddress, getUserAgent } from './security';

export interface AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  code?: string;
}

export class CustomError extends Error implements AppError {
  statusCode: number;
  isOperational: boolean;
  code?: string;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true, code?: string) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.code = code;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

// Specific error types
export class ValidationError extends CustomError {
  constructor(message: string) {
    super(message, 400, true, 'VALIDATION_ERROR');
  }
}

export class AuthenticationError extends CustomError {
  constructor(message: string = 'Authentication required') {
    super(message, 401, true, 'AUTHENTICATION_ERROR');
  }
}

export class AuthorizationError extends CustomError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 403, true, 'AUTHORIZATION_ERROR');
  }
}

export class NotFoundError extends CustomError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, true, 'NOT_FOUND_ERROR');
  }
}

export class ConflictError extends CustomError {
  constructor(message: string) {
    super(message, 409, true, 'CONFLICT_ERROR');
  }
}

export class RateLimitError extends CustomError {
  constructor(message: string = 'Too many requests') {
    super(message, 429, true, 'RATE_LIMIT_ERROR');
  }
}

// Error handling middleware
export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void {
  let error = err as AppError;

  // Log error for monitoring
  console.error('Error occurred:', {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    ip: getClientIpAddress(req),
    userAgent: getUserAgent(req),
    timestamp: new Date().toISOString(),
  });

  // Handle specific error types
  if (err instanceof ZodError) {
    error = new ValidationError(
      `Validation failed: ${err.errors.map(e => e.message).join(', ')}`
    );
  }

  // Handle database errors
  if (err.message?.includes('duplicate key')) {
    error = new ConflictError('Resource already exists');
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = new AuthenticationError('Invalid token');
  }

  if (err.name === 'TokenExpiredError') {
    error = new AuthenticationError('Token expired');
  }

  // Default to 500 if not an operational error
  if (!error.statusCode) {
    error.statusCode = 500;
    error.isOperational = false;
  }

  // Log security-related errors
  if (error.statusCode === 401 || error.statusCode === 403) {
    logAuditEvent({
      action: 'SECURITY_VIOLATION',
      resource: req.path,
      ipAddress: getClientIpAddress(req),
      userAgent: getUserAgent(req),
      metadata: { error: error.message, statusCode: error.statusCode },
    }).catch(console.error);
  }

  // Send error response
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  res.status(error.statusCode).json({
    error: {
      message: error.message,
      code: error.code,
      ...(isDevelopment && error.stack && { stack: error.stack }),
    },
  });
}

// Async error handler wrapper
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

// Not found handler
export function notFoundHandler(req: Request, res: Response, next: NextFunction): void {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
}

// Unhandled rejection and exception handlers
export function setupGlobalErrorHandlers(): void {
  process.on('unhandledRejection', (reason: unknown, promise: Promise<unknown>) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    // In production, you might want to gracefully shutdown here
  });

  process.on('uncaughtException', (error: Error) => {
    console.error('Uncaught Exception:', error);
    // In production, log the error and exit gracefully
    process.exit(1);
  });
}