# Overview

This is a comprehensive student application platform designed to help Caribbean students navigate tertiary education opportunities globally.

## Deployment Solution - FIXED ✅
**Status**: DEPLOYMENT READY

**Problem Resolved**: 
- npm run build was creating dist/index.js (wrong location)
- npm start expects dist/server/index.js (correct location)
- Server couldn't find public directory at dist/server/public
- Missing dist/package.json file

**Solution**: Use `deployment-fix-production.js` script that:
1. Runs vite build and esbuild
2. Moves dist/index.js → dist/server/index.js  
3. Copies dist/public → dist/server/public (where server expects it)
4. Creates dist/package.json with correct configuration
5. Verifies all files and tests deployment

**To Deploy on Replit**: 
- Run `node deployment-fix-production.js` instead of npm run build
- Then npm start will work correctly

**Verified Structure**:
- ✅ dist/server/index.js (202KB backend)
- ✅ dist/server/public/ (frontend assets where server expects them)
- ✅ dist/package.json (production config)
- ✅ All tests passing The system provides a full-stack solution featuring student profiles, university/program search, application management, and an admin dashboard for customer experience teams. The project's vision is to streamline the tertiary education application process for Caribbean students, offering AI-powered recommendations and counseling services.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite

## Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database ORM**: Drizzle ORM
- **Authentication**: JWT-based sessions with bcrypt password hashing
- **File Upload**: Multer with secure file validation
- **Security**: Helmet, rate limiting, CORS, input validation
- **Email**: Nodemailer for transactional emails

## Database Architecture
- **Database**: PostgreSQL with SSL support
- **Schema Management**: Drizzle Kit for migrations
- **Connection**: Neon serverless connection with WebSocket support

## Key Features & Design Decisions
- **Student Portal**: User authentication (including OAuth), comprehensive profile management, advanced university/program search, full application workflow with document upload and status tracking, AI-powered personality assessment with program recommendations, counseling services with booking, and exam preparation resources (CSEC/CAPE study materials, practice tests, study groups).
- **Admin Dashboard**: Application review, document approval, status management, school integration (manual and LeadEnroll API), and analytics/reporting.
- **Security Infrastructure**: Rate limiting, brute force protection, secure session management, input validation, SQL injection/XSS prevention, secure file storage, comprehensive audit logging, and GDPR/CCPA compliance features.
- **Deployment Strategy**: Automated deployment script for build pipeline, environment configuration with Zod schemas, and security hardening for production readiness.

# External Dependencies

- **PostgreSQL Database**: Primary data storage.
- **SMTP Service**: Email delivery.
- **File Storage**: Local file system (with planned cloud storage migration).
- **OpenAI API**: AI-powered personality assessments and program recommendations.
- **Anthropic API**: Alternative AI service for content generation.
- **Stripe**: Payment processing for premium features.
- **LeadEnroll API**: Direct university application submission.
- **OAuth Providers**: Google and Facebook authentication.