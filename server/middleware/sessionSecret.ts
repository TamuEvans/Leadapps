import { randomBytes } from 'crypto';

/**
 * Generate a secure session secret if one doesn't exist
 */
export function generateSessionSecret(): string {
  const existingSecret = process.env.SESSION_SECRET;
  
  if (existingSecret && existingSecret.length >= 32) {
    return existingSecret;
  }
  
  // Generate a new 32-byte secret
  const secret = randomBytes(32).toString('base64');
  
  console.warn('⚠️  No SESSION_SECRET found in environment variables.');
  console.warn('⚠️  Using generated secret for this session.');
  console.warn('⚠️  For production, set SESSION_SECRET in your environment:');
  console.warn(`   SESSION_SECRET=${secret}`);
  
  return secret;
}

/**
 * Get JWT secret for token signing
 */
export function getJWTSecret(): string {
  return process.env.JWT_SECRET || generateSessionSecret();
}