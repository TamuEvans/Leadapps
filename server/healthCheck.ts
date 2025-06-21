
import { Request, Response } from 'express';
import { db } from './db';
import { env } from './environment';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy';
  timestamp: string;
  services: {
    database: 'connected' | 'disconnected' | 'error';
    email: 'configured' | 'missing' | 'error';
    environment: 'valid' | 'invalid';
    storage: 'available' | 'unavailable';
  };
  environment: string;
  uptime: number;
}

export async function healthCheck(req: Request, res: Response): Promise<void> {
  const startTime = Date.now();
  
  const result: HealthCheckResult = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    services: {
      database: 'disconnected',
      email: 'missing',
      environment: 'invalid',
      storage: 'unavailable'
    },
    environment: env.NODE_ENV,
    uptime: process.uptime()
  };

  try {
    // Check database connection
    try {
      await db.execute('SELECT 1');
      result.services.database = 'connected';
    } catch (error) {
      result.services.database = 'error';
      result.status = 'unhealthy';
    }

    // Check email configuration
    if (env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS && env.FROM_EMAIL) {
      result.services.email = 'configured';
    } else {
      result.services.email = 'missing';
    }

    // Check environment variables
    if (env.DATABASE_URL && env.SESSION_SECRET && env.SESSION_SECRET.length >= 32) {
      result.services.environment = 'valid';
    } else {
      result.services.environment = 'invalid';
      result.status = 'unhealthy';
    }

    // Check storage availability
    try {
      const fs = await import('fs/promises');
      await fs.access('./uploads');
      result.services.storage = 'available';
    } catch {
      result.services.storage = 'unavailable';
    }

  } catch (error) {
    result.status = 'unhealthy';
  }

  const responseTime = Date.now() - startTime;
  
  res.status(result.status === 'healthy' ? 200 : 503).json({
    ...result,
    responseTime: `${responseTime}ms`
  });
}

export async function simpleHealthCheck(req: Request, res: Response): Promise<void> {
  res.status(200).json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
}
