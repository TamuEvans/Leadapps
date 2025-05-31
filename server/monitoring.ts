import { Request, Response, NextFunction } from 'express';
import { getClientIpAddress, getUserAgent } from './security';
import { logAuditEvent } from './auditLog';

interface PerformanceMetrics {
  requestCount: number;
  averageResponseTime: number;
  errorRate: number;
  lastReset: Date;
}

interface SecurityMetrics {
  failedLogins: number;
  rateLimitViolations: number;
  suspiciousActivity: number;
  lastReset: Date;
}

class MonitoringService {
  private performanceMetrics: PerformanceMetrics;
  private securityMetrics: SecurityMetrics;
  private activeConnections: Set<string>;

  constructor() {
    this.performanceMetrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastReset: new Date(),
    };
    this.securityMetrics = {
      failedLogins: 0,
      rateLimitViolations: 0,
      suspiciousActivity: 0,
      lastReset: new Date(),
    };
    this.activeConnections = new Set();
  }

  // Performance monitoring middleware
  performanceMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const startTime = Date.now();
      const connectionId = `${getClientIpAddress(req)}_${Date.now()}`;
      
      this.activeConnections.add(connectionId);
      
      res.on('finish', () => {
        const responseTime = Date.now() - startTime;
        this.recordPerformanceMetric(responseTime, res.statusCode >= 400);
        this.activeConnections.delete(connectionId);
      });
      
      next();
    };
  }

  // Security monitoring middleware
  securityMiddleware() {
    return (req: Request, res: Response, next: NextFunction) => {
      const ip = getClientIpAddress(req);
      const userAgent = getUserAgent(req);
      
      // Detect suspicious patterns
      if (this.detectSuspiciousActivity(req, ip, userAgent)) {
        this.securityMetrics.suspiciousActivity++;
        
        logAuditEvent({
          action: 'SUSPICIOUS_ACTIVITY',
          resource: req.path,
          ipAddress: ip,
          userAgent,
          metadata: {
            method: req.method,
            headers: req.headers,
            suspiciousPatterns: this.getSuspiciousPatterns(req),
          },
        });
      }
      
      next();
    };
  }

  private recordPerformanceMetric(responseTime: number, isError: boolean) {
    this.performanceMetrics.requestCount++;
    
    // Update average response time
    const currentAvg = this.performanceMetrics.averageResponseTime;
    const count = this.performanceMetrics.requestCount;
    this.performanceMetrics.averageResponseTime = 
      (currentAvg * (count - 1) + responseTime) / count;
    
    // Update error rate
    if (isError) {
      this.performanceMetrics.errorRate = 
        (this.performanceMetrics.errorRate * (count - 1) + 1) / count;
    } else {
      this.performanceMetrics.errorRate = 
        (this.performanceMetrics.errorRate * (count - 1)) / count;
    }
  }

  private detectSuspiciousActivity(req: Request, ip: string, userAgent: string): boolean {
    const suspiciousPatterns = [
      // SQL injection attempts
      /(\b(union|select|insert|update|delete|drop|create|alter)\b)/i,
      // XSS attempts
      /<script|javascript:|on\w+=/i,
      // Path traversal
      /\.\.\//,
      // Command injection
      /[;&|`]/,
    ];

    const requestString = `${req.url} ${JSON.stringify(req.body)} ${JSON.stringify(req.query)}`;
    
    return suspiciousPatterns.some(pattern => pattern.test(requestString)) ||
           userAgent.toLowerCase().includes('bot') ||
           userAgent.toLowerCase().includes('crawler') ||
           this.isRapidRequests(ip);
  }

  private getSuspiciousPatterns(req: Request): string[] {
    const patterns = [];
    const requestString = `${req.url} ${JSON.stringify(req.body)}`;
    
    if (/(\b(union|select|insert|update|delete|drop|create|alter)\b)/i.test(requestString)) {
      patterns.push('SQL_INJECTION_ATTEMPT');
    }
    if (/<script|javascript:|on\w+=/i.test(requestString)) {
      patterns.push('XSS_ATTEMPT');
    }
    if (/\.\.\//.test(requestString)) {
      patterns.push('PATH_TRAVERSAL');
    }
    
    return patterns;
  }

  private requestCounts = new Map<string, { count: number; lastRequest: Date }>();

  private isRapidRequests(ip: string): boolean {
    const now = new Date();
    const entry = this.requestCounts.get(ip);
    
    if (!entry) {
      this.requestCounts.set(ip, { count: 1, lastRequest: now });
      return false;
    }
    
    const timeDiff = now.getTime() - entry.lastRequest.getTime();
    
    if (timeDiff < 1000) { // Less than 1 second
      entry.count++;
      entry.lastRequest = now;
      return entry.count > 10; // More than 10 requests per second
    } else {
      // Reset count if more than 1 second has passed
      this.requestCounts.set(ip, { count: 1, lastRequest: now });
      return false;
    }
  }

  // Health check endpoint data
  getHealthStatus() {
    return {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      activeConnections: this.activeConnections.size,
      performance: {
        ...this.performanceMetrics,
        requestsPerMinute: this.getRequestsPerMinute(),
      },
      security: this.securityMetrics,
    };
  }

  private getRequestsPerMinute(): number {
    const minutesSinceReset = (Date.now() - this.performanceMetrics.lastReset.getTime()) / 60000;
    return minutesSinceReset > 0 ? this.performanceMetrics.requestCount / minutesSinceReset : 0;
  }

  // Alert thresholds
  checkAlertThresholds() {
    const alerts = [];
    
    if (this.performanceMetrics.averageResponseTime > 5000) {
      alerts.push('HIGH_RESPONSE_TIME');
    }
    
    if (this.performanceMetrics.errorRate > 0.1) {
      alerts.push('HIGH_ERROR_RATE');
    }
    
    if (this.securityMetrics.failedLogins > 100) {
      alerts.push('HIGH_FAILED_LOGINS');
    }
    
    if (this.securityMetrics.suspiciousActivity > 50) {
      alerts.push('HIGH_SUSPICIOUS_ACTIVITY');
    }
    
    return alerts;
  }

  // Reset metrics (called periodically)
  resetMetrics() {
    this.performanceMetrics = {
      requestCount: 0,
      averageResponseTime: 0,
      errorRate: 0,
      lastReset: new Date(),
    };
    
    this.securityMetrics = {
      failedLogins: 0,
      rateLimitViolations: 0,
      suspiciousActivity: 0,
      lastReset: new Date(),
    };
  }

  // Method to be called on failed login
  recordFailedLogin() {
    this.securityMetrics.failedLogins++;
  }

  // Method to be called on rate limit violation
  recordRateLimitViolation() {
    this.securityMetrics.rateLimitViolations++;
  }
}

export const monitoring = new MonitoringService();

// Health check route
export function healthCheckHandler(req: Request, res: Response) {
  const health = monitoring.getHealthStatus();
  const alerts = monitoring.checkAlertThresholds();
  
  res.json({
    ...health,
    alerts,
  });
}