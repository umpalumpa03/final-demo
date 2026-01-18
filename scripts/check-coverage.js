#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');

const COVERAGE_THRESHOLD = 80;

// Parse coverage-final.json file
function parseCoverageJson(jsonPath) {
  const coverageData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const files = {};

  Object.keys(coverageData).forEach(filePath => {
    const fileData = coverageData[filePath];
    const statements = fileData.s || {};
    
    const statementValues = Object.values(statements);
    const totalStatements = statementValues.length;
    const hitStatements = statementValues.filter(count => count > 0).length;
    
    // Normalize path (remove absolute path, keep relative)
    const normalizedPath = filePath.replace(/\\/g, '/').split('/apps/tia-frontend/').pop() || 
                           filePath.replace(/\\/g, '/').split('/src/').pop() ||
                           filePath;
    
    files[normalizedPath] = {
      statements: { hit: hitStatements, found: totalStatements }
    };
  });

  return files;
}

// Get changed files from git diff
function getChangedFiles(baseBranch = 'origin/main') {
  try {
    const diffOutput = execSync(`git diff --name-only ${baseBranch}...HEAD`, { encoding: 'utf8' });
    return diffOutput
      .split('\n')
      .filter(file => file.endsWith('.ts') || file.endsWith('.tsx') || file.endsWith('.js') || file.endsWith('.jsx'))
      .filter(file => !file.includes('.spec.') && !file.includes('.test.'))
      .filter(file => !file.startsWith('scripts/')) // Exclude scripts folder
      .filter(file => !file.includes('node_modules'))
      .map(file => file.trim())
      .filter(Boolean);
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    return [];
  }
}

// Calculate coverage percentage (using statement coverage)
function calculateCoverage(fileData) {
  const total = fileData.statements.found;
  const hit = fileData.statements.hit;

  if (total === 0) return 100;
  
  return (hit / total) * 100;
}

// Main function
function checkCoverage() {
  // Try multiple possible coverage locations
  const possiblePaths = [
    './coverage/apps/tia-frontend/coverage-final.json',
    './coverage/coverage-final.json',
    './apps/tia-frontend/coverage/coverage-final.json',
  ];

  let coveragePath = null;
  for (const path of possiblePaths) {
    if (fs.existsSync(path)) {
      coveragePath = path;
      console.log(`✅ Found coverage file at: ${path}\n`);
      break;
    }
  }

  if (!coveragePath) {
    console.error('❌ Coverage file not found in any of these locations:');
    possiblePaths.forEach(path => console.error(`   - ${path}`));
    console.error('\nPlease check your coverage output directory.');
    process.exit(1);
  }

  const coverageData = parseCoverageJson(coveragePath);
  const changedFiles = getChangedFiles();

  if (changedFiles.length === 0) {
    console.log('✅ No source files changed. Skipping coverage check.');
    process.exit(0);
  }

  console.log('📊 Checking coverage for changed files...\n');

  // Debug: show coverage file paths
  console.log('📁 Coverage files found:');
  Object.keys(coverageData).slice(0, 5).forEach(key => console.log(`   ${key}`));
  if (Object.keys(coverageData).length > 5) {
    console.log(`   ... and ${Object.keys(coverageData).length - 5} more\n`);
  } else {
    console.log('');
  }

  let failedFiles = [];
  let passedFiles = [];

  changedFiles.forEach(file => {
    // Try to find the file in coverage data (normalize paths)
    // Match by filename or path segments
    const coverageFile = Object.keys(coverageData).find(key => {
      const normalizedKey = key.replace(/\\/g, '/');
      const normalizedFile = file.replace(/\\/g, '/');
      
      // Check if paths match
      return normalizedKey === normalizedFile || 
             normalizedKey.endsWith(normalizedFile) || 
             normalizedFile.endsWith(normalizedKey);
    });

    if (!coverageFile) {
      console.log(`⚠️  ${file} - No coverage data found (possibly untested)`);
      failedFiles.push({ file, coverage: 0 });
      return;
    }

    const coverage = calculateCoverage(coverageData[coverageFile]);
    const status = coverage >= COVERAGE_THRESHOLD ? '✅' : '❌';
    
    console.log(`${status} ${file} - ${coverage.toFixed(2)}%`);

    if (coverage < COVERAGE_THRESHOLD) {
      failedFiles.push({ file, coverage });
    } else {
      passedFiles.push({ file, coverage });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(`📈 Summary: ${passedFiles.length} passed, ${failedFiles.length} failed`);
  console.log('='.repeat(60) + '\n');

  if (failedFiles.length > 0) {
    console.error(`❌ Coverage check failed! The following files have less than ${COVERAGE_THRESHOLD}% coverage:\n`);
    failedFiles.forEach(({ file, coverage }) => {
      console.error(`   ${file}: ${coverage.toFixed(2)}%`);
    });
    console.error(`\n💡 Tip: Add tests for the changed/new code to reach ${COVERAGE_THRESHOLD}% coverage.\n`);
    process.exit(1);
  }

  console.log(`✅ All changed files have at least ${COVERAGE_THRESHOLD}% coverage!\n`);
  process.exit(0);
}

checkCoverage();