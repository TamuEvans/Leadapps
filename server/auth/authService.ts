import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { storage } from '../storage';
import { LoginInput, RegisterInput } from '@shared/schema';
import { getJWTSecret } from '../middleware/sessionSecret';

// Secret for JWT token generation - uses secure session secret generation
const JWT_SECRET = getJWTSecret();
const JWT_EXPIRES_IN = '7d'; // 7 days

/**
 * Generate a JWT token for a user
 */
export const generateToken = (userId: number): string => {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

/**
 * Verify and decode a JWT token
 */
export const verifyToken = (token: string): { userId: number } | null => {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };
    return decoded;
  } catch (error) {
    return null;
  }
};

/**
 * Register a new user with email and password
 */
export const registerUser = async (data: RegisterInput) => {
  // Check if user already exists
  const existingUser = await storage.getUserByEmail(data.email);
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // Hash the password
  const hashedPassword = await bcrypt.hash(data.password, 10);

  // Create the user
  const user = await storage.createUser({
    email: data.email,
    password: hashedPassword,
    firstName: data.firstName,
    lastName: data.lastName,
    username: null, // Use email as primary identifier
  });

  // Generate token
  const token = generateToken(user.id);

  // Store session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days
  await storage.createSession(user.id, token, expiresAt);

  return { user, token };
};

/**
 * Login a user with email and password
 */
export const loginUser = async (data: LoginInput) => {
  // Find user by email
  const user = await storage.getUserByEmail(data.email);
  if (!user) {
    throw new Error('Invalid email or password');
  }

  // Check password
  if (!user.password) {
    throw new Error('This account uses a social login method');
  }

  const isPasswordValid = await bcrypt.compare(data.password, user.password);
  if (!isPasswordValid) {
    throw new Error('Invalid email or password');
  }

  // Generate token
  const token = generateToken(user.id);

  // Create session with appropriate expiry
  const expiresAt = new Date();
  if (data.rememberMe) {
    expiresAt.setDate(expiresAt.getDate() + 30); // 30 days for "remember me"
  } else {
    expiresAt.setDate(expiresAt.getDate() + 1); // 1 day default
  }
  await storage.createSession(user.id, token, expiresAt);

  return { user, token };
};

/**
 * Process Google login/registration
 */
export const processGoogleLogin = async (profile: any) => {
  const { id, emails, name, photos } = profile;
  
  if (!emails || emails.length === 0) {
    throw new Error('Email is required from Google profile');
  }

  const email = emails[0].value;
  const firstName = name?.givenName || '';
  const lastName = name?.familyName || '';
  const profileImageUrl = photos && photos.length > 0 ? photos[0].value : null;

  // Check if user exists with this Google ID
  let user = await storage.getUserByGoogleId(id);

  // If not found by Google ID, try to find by email
  if (!user) {
    user = await storage.getUserByEmail(email);
    
    if (user) {
      // User found by email, update with Google ID
      user = await storage.updateUser(user.id, {
        googleId: id,
        profileImageUrl: profileImageUrl || user.profileImageUrl,
      });
    } else {
      // Create new user
      user = await storage.createUser({
        email,
        firstName,
        lastName,
        googleId: id,
        profileImageUrl,
        isVerified: true, // Google verified email
      });
    }
  }

  // Generate token
  const token = generateToken(user.id);

  // Store session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days for OAuth logins
  await storage.createSession(user.id, token, expiresAt);

  return { user, token };
};

/**
 * Process Facebook login/registration
 */
export const processFacebookLogin = async (profile: any) => {
  const { id, emails, name, photos } = profile;
  
  if (!emails || emails.length === 0) {
    throw new Error('Email is required from Facebook profile');
  }

  const email = emails[0].value;
  const firstName = name?.givenName || '';
  const lastName = name?.familyName || '';
  const profileImageUrl = photos && photos.length > 0 ? photos[0].value : null;

  // Check if user exists with this Facebook ID
  let user = await storage.getUserByFacebookId(id);

  // If not found by Facebook ID, try to find by email
  if (!user) {
    user = await storage.getUserByEmail(email);
    
    if (user) {
      // User found by email, update with Facebook ID
      user = await storage.updateUser(user.id, {
        facebookId: id,
        profileImageUrl: profileImageUrl || user.profileImageUrl,
      });
    } else {
      // Create new user
      user = await storage.createUser({
        email,
        firstName,
        lastName,
        facebookId: id,
        profileImageUrl,
        isVerified: true, // Facebook verified email
      });
    }
  }

  // Generate token
  const token = generateToken(user.id);

  // Store session
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30); // 30 days for OAuth logins
  await storage.createSession(user.id, token, expiresAt);

  return { user, token };
};

/**
 * Logout a user
 */
export const logoutUser = async (token: string) => {
  await storage.deleteSession(token);
  return true;
};

/**
 * Get current user from token
 */
export const getCurrentUser = async (token: string) => {
  if (!token) return null;
  
  // Verify the token is valid
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  // Check if session exists
  const session = await storage.getSessionByToken(token);
  if (!session) return null;
  
  // Get the user
  const user = await storage.getUser(decoded.userId);
  if (!user) return null;
  
  return user;
};