# Deployment Guide

## Quick Start
To build for deployment, run:
```bash
node scripts/production-build.js
```

## What the deployment fix includes:

### ✅ Fixed Build Output Structure
- Backend now builds to `dist/server/index.js` (not `dist/index.js`)
- Frontend builds to `dist/public/` directory
- Production `package.json` created in `dist/` directory

### ✅ Correct Production Package.json
```json
{
  "name": "rest-express-production",
  "version": "1.0.0",
  "type": "module",
  "main": "server/index.js",
  "scripts": {
    "start": "node server/index.js",
    "health": "curl -f http://localhost:5000/health || exit 1"
  },
  "engines": {
    "node": ">=18.0.0"
  }
}
```

### ✅ Updated Build Process
1. **Frontend Build**: Vite builds to `dist/public/`
2. **Backend Build**: esbuild compiles to `dist/server/index.js`
3. **Production Config**: Creates proper `package.json` with correct entry point
4. **Verification**: Validates all required files exist

### ✅ Scripts Available
- `scripts/production-build.js` - Complete production build
- `scripts/fix-build-structure.js` - Fix existing build structure
- `scripts/verify-deployment-ready.js` - Verify deployment readiness

## Verification
Run this to check if build is ready:
```bash
node scripts/verify-deployment-ready.js
```

## For Replit Deployment
1. Run the production build script
2. Verify all checks pass
3. Deploy using Replit's deployment interface
4. The deployment will use `npm start` which runs `node server/index.js`

## Environment Variables
Make sure these are set in production:
- `DATABASE_URL` - PostgreSQL connection string
- `SESSION_SECRET` - For session management
- Any API keys for external services