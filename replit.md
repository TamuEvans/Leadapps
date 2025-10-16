# Overview

LeadApps is a comprehensive educational platform designed specifically for Caribbean students pursuing tertiary education. The application serves as a complete student portal offering services including university search, application management, personality assessment, exam preparation, counseling, and study resources. It functions as a bridge connecting Caribbean students to educational opportunities worldwide while providing personalized guidance and support throughout their academic journey.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
- **Framework**: React with TypeScript and Vite for build tooling
- **UI Components**: shadcn/ui component library with Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Authentication**: Cookie-based JWT authentication with protected routes

## Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Passport.js with local, Google, and Facebook strategies
- **File Structure**: Monorepo structure with shared schema between client and server

## Data Storage Solutions
- **Primary Database**: Supabase (PostgreSQL) - Fully integrated and operational
- **Schema Management**: Drizzle migrations with centralized schema definitions
- **File Storage**: Configured for document uploads with multiple format support
- **Session Storage**: Database-backed session management for authentication
- **Bulk Import System**: CSV/Excel file parsing for universities and programs data

## Authentication and Authorization
- **Multi-provider Authentication**: Local email/password, Google OAuth, Facebook OAuth
- **JWT Token Management**: Secure token generation with cookie-based storage
- **Session Persistence**: Database-backed sessions with expiration handling
- **Protected Routes**: Middleware-based route protection for authenticated endpoints

## Key System Components
- **Student Profile System**: Comprehensive profile management with completion tracking
- **University Search**: Advanced filtering and search capabilities for institutions and programs
- **Application Management**: Complete application workflow with document handling
- **Personality Assessment**: AI-powered career guidance and program recommendations
- **Exam Preparation**: Resource management system for CSEC, CAPE, and SAT preparation
- **Counseling System**: Appointment booking with session management
- **Messaging System**: Real-time communication between students and counselors
- **Agent Management System**: Complete agent portal for managing student portfolios (Phase 2 & 3)
  - Role-based authentication and authorization
  - Student list with search and filtering capabilities
  - Invitation system for onboarding students
  - Individual student detail views with profile and application tracking
  - Agent notes and status management
  - Secure API endpoints with input validation
- **Admin Panel System**: Platform administration and oversight (Phase 7) - COMPLETED
  - **Dashboard** (✅ Complete): Platform analytics showing user/application/university/program counts, application stats by status, and recent users list
  - **User Management** (✅ Complete): Full CRUD operations - list, search by name/email, filter by role, view details, edit (firstName, lastName, email, role), and delete with confirmation
  - **University Management** (✅ Complete): Full CRUD - list, search, add (name, country, city, website, description), edit, and delete with /api/admin/universities endpoints
  - **Program Management** (✅ Complete): Full CRUD - list, search, add (name, university, level, degree, discipline, duration, description), edit, and delete with /api/admin/programs endpoints
  - **Authentication & Authorization** (✅ Complete): Role-based access control via requireAdmin middleware protecting all admin routes
  - **Admin Layout** (✅ Complete): Dedicated admin layout with sidebar navigation for dashboard, users, universities, programs, content, and settings pages
  - **Content Management** (✅ Complete): Full CRUD for articles and exam resources
    - Articles: List, search, add (title, slug, content, excerpt, category, published status), edit, and delete
    - Exam Resources: List, search, add (title, description, examType, subject, resourceType, resourceUrl, difficulty, premium), edit, and delete
    - Database schema with articles table (title, slug, content, excerpt, category, tags, author, published status)
    - Zod-validated API endpoints (/api/admin/articles, /api/admin/exam-resources) with proper error handling
    - Dual-tab UI with search, form validation, loading states, and cache invalidation
  - **Settings Management** (✅ Complete): Platform configuration UI with feature toggles
    - Platform settings (student registration, agent access, maintenance mode)
    - Email notification settings (from address, status updates, message alerts)
    - Payment configuration (application fee, payment processing toggle)
    - Note: UI-only placeholder - no backend persistence yet (per requirements)

# External Dependencies

## AI and Machine Learning
- **OpenAI API**: Powers personality assessments and program recommendations
- **Anthropic API**: Alternative AI provider for advanced text processing

## Payment Processing
- **Stripe**: Complete payment infrastructure for application fees and premium services
- **Multi-currency Support**: Handles international payments for Caribbean students

## Database Services
- **Neon Database**: Serverless PostgreSQL hosting with connection pooling
- **WebSocket Support**: Real-time database connections for messaging features

## Authentication Providers
- **Google OAuth**: Social authentication for student accounts
- **Facebook OAuth**: Alternative social login option
- **Passport.js Strategies**: Unified authentication framework

## Development and Monitoring
- **Replit Integration**: Development environment optimization with runtime error handling
- **Vite Development Server**: Hot module replacement and development tooling
- **TypeScript**: Full-stack type safety with shared schema definitions

## UI and Styling
- **Radix UI**: Accessible component primitives for complex interactions
- **Dicebear Avatars**: Programmatic avatar generation for user profiles
- **Custom Font Integration**: Made Tommy font family with Manrope fallback

## File Processing
- **XLSX and CSV Parsing**: Bulk data import capabilities for administrative functions
- **Multer**: File upload middleware with validation and storage management