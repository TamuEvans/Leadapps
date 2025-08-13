#!/usr/bin/env node

/**
 * Verification script to check if the build is ready for deployment
 * Validates file structure, package.json content, and entry points
 */

import { existsSync, readFileSync } from 'fs';

console.log('🔍 Verifying deployment readiness...');

const checks = [
  {
    name: 'Backend entry point exists',
    check: () => existsSync('dist/server/index.js'),
    fix: 'Run the build script to generate the backend bundle'
  },
  {
    name: 'Production package.json exists',
    check: () => existsSync('dist/package.json'),
    fix: 'Create production package.json with correct start script'
  },
  {
    name: 'Frontend build exists',
    check: () => existsSync('dist/public/index.html'),
    fix: 'Run vite build to generate frontend assets'
  },
  {
    name: 'Package.json has correct start script',
    check: () => {
      if (!existsSync('dist/package.json')) return false;
      try {
        const pkg = JSON.parse(readFileSync('dist/package.json', 'utf8'));
        return pkg.scripts && pkg.scripts.start === 'node server/index.js';
      } catch {
        return false;
      }
    },
    fix: 'Update package.json start script to "node server/index.js"'
  },
  {
    name: 'Package.json has correct main field',
    check: () => {
      if (!existsSync('dist/package.json')) return false;
      try {
        const pkg = JSON.parse(readFileSync('dist/package.json', 'utf8'));
        return pkg.main === 'server/index.js';
      } catch {
        return false;
      }
    },
    fix: 'Set package.json main field to "server/index.js"'
  }
];

let allPassed = true;
const failedChecks = [];

checks.forEach(({ name, check, fix }) => {
  const passed = check();
  console.log(`${passed ? '✅' : '❌'} ${name}`);
  
  if (!passed) {
    allPassed = false;
    failedChecks.push({ name, fix });
  }
});

if (allPassed) {
  console.log('\n🚀 All deployment checks passed! Ready for deployment.');
} else {
  console.log('\n❌ Deployment readiness check failed. Issues found:');
  failedChecks.forEach(({ name, fix }) => {
    console.log(`   - ${name}: ${fix}`);
  });
  console.log('\nRun the build script to fix these issues.');
}

process.exit(allPassed ? 0 : 1);