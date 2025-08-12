# HOW TO DEPLOY - STEP BY STEP INSTRUCTIONS

## Quick Deployment Process

Run these commands in order, then immediately click Deploy:

### Step 1: Clean and Build
```bash
./correct-build.sh
```

### Step 2: Verify Structure (optional)
```bash
ls -la dist/server/index.js
ls -la dist/package.json
```

### Step 3: Deploy
Click the "Deploy" button in Replit immediately after the build completes.

---

## Detailed Instructions

### Before You Start:
- Make sure you're in the project root directory
- The `correct-build.sh` file should be executable (it is)

### Command Breakdown:

**`./correct-build.sh`** does the following:
1. Removes old `dist/` folder
2. Runs `vite build` (frontend)
3. Runs `esbuild` with correct parameters (backend)
4. Creates production `package.json`
5. Creates uploads directory
6. Verifies all files are in correct locations

### What You'll See:
```
🚀 Running corrected build process...
📦 Building frontend...
[vite build output]
📦 Building backend...
[esbuild output]
📦 Creating production configuration...
✅ Build completed with correct structure!
🎉 DEPLOYMENT READY!
```

### After the Build:
- **Immediately** click Deploy in Replit
- Don't run any other commands that might change the dist/ folder
- The deployment should now succeed because files are in correct locations

---

## Why This Works:

The deployment fails because:
- `npm run build` creates `dist/index.js` (wrong location)
- `npm start` expects `dist/server/index.js` (correct location)

Our script fixes this by using the correct esbuild parameters to create files where the deployment system expects them.