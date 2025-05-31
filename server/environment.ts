import { z } from "zod";

// Environment variable validation schema
const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  DATABASE_URL: z.string().url("DATABASE_URL must be a valid URL"),
  SESSION_SECRET: z.string().min(32, "SESSION_SECRET must be at least 32 characters"),
  
  // Optional OAuth credentials
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  FACEBOOK_APP_ID: z.string().optional(),
  FACEBOOK_APP_SECRET: z.string().optional(),
  
  // Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  FROM_EMAIL: z.string().email().optional(),
  
  // Production settings
  ALLOWED_ORIGINS: z.string().optional(),
  UPLOAD_MAX_SIZE: z.coerce.number().default(10485760), // 10MB default
  
  // API Keys
  OPENAI_API_KEY: z.string().optional(),
  ANTHROPIC_API_KEY: z.string().optional(),
  
  // Payment processing
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
});

export type Environment = z.infer<typeof envSchema>;

let validatedEnv: Environment;

export function validateEnvironment(): Environment {
  if (validatedEnv) {
    return validatedEnv;
  }

  try {
    validatedEnv = envSchema.parse(process.env);
    return validatedEnv;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => 
        `${err.path.join('.')}: ${err.message}`
      ).join('\n');
      
      console.error('❌ Environment validation failed:');
      console.error(missingVars);
      
      // In development, show helpful hints
      if (process.env.NODE_ENV !== 'production') {
        console.error('\n💡 Development hints:');
        console.error('- Add SESSION_SECRET to your environment variables');
        console.error('- Ensure DATABASE_URL is properly configured');
        console.error('- Add email configuration for notifications');
      }
      
      process.exit(1);
    }
    throw error;
  }
}

export const env = validateEnvironment();