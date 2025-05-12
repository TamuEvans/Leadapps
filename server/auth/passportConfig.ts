import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { Strategy as LocalStrategy } from 'passport-local';
import bcrypt from 'bcryptjs';
import { storage } from '../storage';

export const configurePassport = () => {
  // Configure Local Strategy (email/password)
  passport.use(
    new LocalStrategy(
      { usernameField: 'email' },
      async (email, password, done) => {
        try {
          // Find user by email
          const user = await storage.getUserByEmail(email);
          
          if (!user) {
            return done(null, false, { message: 'Invalid credentials' });
          }
          
          // Check password
          const isPasswordValid = await bcrypt.compare(password, user.password as string);
          
          if (!isPasswordValid) {
            return done(null, false, { message: 'Invalid credentials' });
          }
          
          return done(null, user);
        } catch (error) {
          console.error('Error in Local Strategy:', error);
          return done(error);
        }
      }
    )
  );

  // Configure Google Strategy
  if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(
      new GoogleStrategy(
        {
          clientID: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
          callbackURL: '/api/auth/google/callback',
          scope: ['profile', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists by Google ID
            let user = await storage.getUserByGoogleId(profile.id);
            
            if (user) {
              return done(null, user);
            }
            
            // Check if user exists by email
            const email = profile.emails?.[0]?.value;
            
            if (email) {
              user = await storage.getUserByEmail(email);
              
              if (user) {
                // Update user with Google ID
                user = await storage.updateUser(user.id, {
                  googleId: profile.id,
                  updatedAt: new Date()
                });
                
                return done(null, user);
              }
            }
            
            // Create new user
            const newUser = await storage.createUser({
              email: email || `${profile.id}@google.com`,
              password: null,
              username: null,
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              profileImageUrl: profile.photos?.[0]?.value || null,
              googleId: profile.id,
              facebookId: null,
              isVerified: true,
              updatedAt: null
            });
            
            return done(null, newUser);
          } catch (error) {
            console.error('Error in Google Strategy:', error);
            return done(error);
          }
        }
      )
    );
  } else {
    console.log('Google OAuth credentials missing. Google authentication is disabled.');
  }

  // Configure Facebook Strategy
  if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(
      new FacebookStrategy(
        {
          clientID: process.env.FACEBOOK_APP_ID,
          clientSecret: process.env.FACEBOOK_APP_SECRET,
          callbackURL: '/api/auth/facebook/callback',
          profileFields: ['id', 'emails', 'name', 'picture.type(large)'],
        },
        async (accessToken, refreshToken, profile, done) => {
          try {
            // Check if user exists by Facebook ID
            let user = await storage.getUserByFacebookId(profile.id);
            
            if (user) {
              return done(null, user);
            }
            
            // Check if user exists by email
            const email = profile.emails?.[0]?.value;
            
            if (email) {
              user = await storage.getUserByEmail(email);
              
              if (user) {
                // Update user with Facebook ID
                user = await storage.updateUser(user.id, {
                  facebookId: profile.id,
                  updatedAt: new Date()
                });
                
                return done(null, user);
              }
            }
            
            // Create new user
            const newUser = await storage.createUser({
              email: email || `${profile.id}@facebook.com`,
              password: null,
              username: null,
              firstName: profile.name?.givenName || null,
              lastName: profile.name?.familyName || null,
              profileImageUrl: profile.photos?.[0]?.value || null,
              googleId: null,
              facebookId: profile.id,
              isVerified: true,
              updatedAt: null
            });
            
            return done(null, newUser);
          } catch (error) {
            console.error('Error in Facebook Strategy:', error);
            return done(error);
          }
        }
      )
    );
  } else {
    console.log('Facebook OAuth credentials missing. Facebook authentication is disabled.');
  }

  // Serialize user to the session
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  // Deserialize user from the session
  passport.deserializeUser(async (id: number, done) => {
    try {
      const user = await storage.getUser(id);
      done(null, user || undefined);
    } catch (error) {
      done(error);
    }
  });
};