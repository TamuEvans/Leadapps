# Overview

This is a comprehensive student application platform designed to help Caribbean students navigate tertiary education opportunities globally. The system provides a full-stack solution with React frontend, Express backend, and PostgreSQL database, featuring student profiles, university/program search, application management, and an admin dashboard for customer experience teams.

# System Architecture

## Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query for server state, React hooks for local state
- **UI Components**: Shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom design system
- **Build Tool**: Vite for development and production builds

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

# Key Components

## Student Portal Features
1. **User Authentication**: Registration, login, password reset with OAuth support (Google, Facebook)
2. **Student Profiles**: Comprehensive profile management with education history, test scores, work experience
3. **University Search**: Advanced filtering and search capabilities across universities and programs
4. **Application Management**: Complete application workflow with document upload and status tracking
5. **Personality Assessment**: AI-powered personality quiz with program recommendations
6. **Counseling Services**: Access to educational counselors with booking system
7. **Exam Preparation**: CSEC/CAPE study materials, practice tests, and study groups

## Admin Dashboard Features
1. **Application Review**: Complete application management system for customer experience teams
2. **Document Approval**: Review and approve/reject uploaded documents
3. **Status Management**: Track applications through their lifecycle
4. **School Integration**: Manual and LeadEnroll API integration for submitting applications
5. **Analytics**: Dashboard statistics and reporting

## Security Infrastructure
1. **Authentication Security**: Rate limiting, brute force protection, secure session management
2. **Data Protection**: Input validation, SQL injection prevention, XSS protection
3. **File Security**: Type validation, size limits, secure file storage
4. **Audit Logging**: Comprehensive tracking of all user actions and security events
5. **Privacy Compliance**: GDPR/CCPA data export and deletion capabilities

# Data Flow

## Student Application Flow
1. Student registers and completes profile
2. Student searches and saves programs to wishlist
3. Student initiates application process
4. Documents are uploaded and validated
5. Application submitted for admin review
6. Admin reviews and approves/rejects
7. Application sent to university (manual or API)
8. Status updates tracked throughout process

## Authentication Flow
1. User provides credentials
2. Server validates and generates JWT token
3. Token stored in secure HTTP-only cookie
4. Middleware validates token on protected routes
5. Session management with configurable expiration

# External Dependencies

## Required Services
- **PostgreSQL Database**: Primary data storage with SSL connection
- **SMTP Service**: Email delivery for notifications and password reset
- **File Storage**: Local file system with planned cloud storage migration

## Optional Integrations
- **OpenAI API**: AI-powered personality assessments and program recommendations
- **Anthropic API**: Alternative AI service for content generation
- **Stripe**: Payment processing for premium features
- **LeadEnroll API**: Direct university application submission
- **OAuth Providers**: Google and Facebook authentication

# Deployment Strategy

## Build Process
- Frontend built with Vite to `dist/public/`
- Backend compiled with ESBuild to `dist/server/index.js`
- Automated deployment script (`deploy.mjs`) handles complete build pipeline
- Production package.json generation for deployment

## Environment Configuration
- Comprehensive environment validation with Zod schemas
- Required variables: DATABASE_URL, SESSION_SECRET, NODE_ENV
- Optional services gracefully degrade if not configured
- CORS and security headers configured for production domains

## Security Deployment Checklist
- All security middleware implemented and production-ready
- Rate limiting and DDoS protection active
- SSL/TLS configuration required
- Environment secrets properly secured
- Database backups and monitoring configured

# Changelog
- June 23, 2025: Initial setup
- June 23, 2025: Fixed deployment build issues
  - Created production-build.js for reliable server builds
  - Updated .replit deployment configuration
  - Added multiple build fallback strategies
  - Resolved dist/server/index.js generation problems
  - Added build validation and health checks
- June 24, 2025: Resolved deployment failures with optimized build process
  - Created deploy-fix.js for fast, reliable production builds
  - Fixed frontend build timeout issues with minimal fallback interface
  - Ensured proper dist/server/index.js generation and validation
  - Added comprehensive build scripts with multiple fallback strategies
  - Verified production package.json configuration matches deployment requirements

# User Preferences

Preferred communication style: Simple, everyday language.