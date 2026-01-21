#!/usr/bin/env node

const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

const COVERAGE_THRESHOLD = 80;

// Read and parse vitest config to get exclude patterns
function getExcludePatternsFromConfig() {
  const configPath = './apps/tia-frontend/vite.config.mts';

  if (!fs.existsSync(configPath)) {
    console.warn('⚠️  Could not find vite.config.mts, using default excludes');
    return ['**/*.routes.ts', '**/*.config.*', '**/main.ts'];
  }

  try {
    const configContent = fs.readFileSync(configPath, 'utf8');
    // Extract exclude array using regex
    const excludeMatch = configContent.match(/exclude:\s*\[([\s\S]*?)\]/);

    if (!excludeMatch) {
      return [];
    }

    // Parse the exclude patterns from the matched string
    const excludeArrayStr = excludeMatch[1];
    const patterns = excludeArrayStr
      .split(',')
      .map((line) => {
        const match = line.match(/['"`](.*?)['"`]/);
        return match ? match[1] : null;
      })
      .filter(Boolean);

    return patterns;
  } catch (error) {
    console.warn('⚠️  Error parsing vite.config.mts:', error.message);
    return [];
  }
}

// Check if a file matches any exclude pattern
function isFileExcluded(filePath, excludePatterns) {
  return excludePatterns.some((pattern) => {
    // Convert glob pattern to regex (handle ** before * to avoid conflicts)
    let regexPattern = pattern
      .replace(/\./g, '\\.') // Escape dots first
      .replace(/\*\*/g, ':::DOUBLESTAR:::') // Placeholder for **
      .replace(/\*/g, '[^/]*') // Single * matches anything except /
      .replace(/:::DOUBLESTAR:::/g, '.*'); // ** matches anything including /

    // Make pattern work for both full paths and relative paths
    // Pattern should match if it appears anywhere in the path
    const regex = new RegExp(regexPattern);

    const matches = regex.test(filePath);

    return matches;
  });
}

// Parse coverage-final.json file
function parseCoverageJson(jsonPath) {
  const coverageData = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const files = {};

  Object.keys(coverageData).forEach((filePath) => {
    const fileData = coverageData[filePath];
    const statements = fileData.s || {};

    const statementValues = Object.values(statements);
    const totalStatements = statementValues.length;
    const hitStatements = statementValues.filter((count) => count > 0).length;

    // Normalize path (remove absolute path, keep relative)
    const normalizedPath =
      filePath.replace(/\\/g, '/').split('/apps/tia-frontend/').pop() ||
      filePath.replace(/\\/g, '/').split('/src/').pop() ||
      filePath;

    files[normalizedPath] = {
      statements: { hit: hitStatements, found: totalStatements },
    };
  });

  return files;
}

// Get changed files from git diff
function getChangedFiles(baseBranch = 'origin/main') {
  try {
    const diffOutput = execSync(`git diff --name-only ${baseBranch}...HEAD`, {
      encoding: 'utf8',
    });
    return diffOutput
      .split('\n')
      .filter(
        (file) =>
          file.endsWith('.ts') ||
          file.endsWith('.tsx') ||
          file.endsWith('.js') ||
          file.endsWith('.jsx'),
      )
      .filter((file) => !file.includes('.spec.') && !file.includes('.test.'))
      .filter((file) => !file.startsWith('scripts/')) // Exclude scripts folder
      .filter((file) => !file.includes('node_modules'))
      .map((file) => file.trim())
      .filter(Boolean)
      .filter((file) => fs.existsSync(file));
  } catch (error) {
    console.error('Error getting changed files:', error.message);
    return [];
  }
}

// Calculate coverage percentage (using statement coverage)
function calculateCoverage(fileData) {
  const total = fileData.statements.found;
  const hit = fileData.statements.hit;

  if (total === 0) {
    // File has no statements - could be empty, types-only, or not covered
    return null; // Return null to indicate "no coverage data"
  }

  return (hit / total) * 100;
}

// Main function
function checkCoverage() {
  // Get exclude patterns from vitest config
  const excludePatterns = getExcludePatternsFromConfig();
  console.log(
    '📋 Exclude patterns from config:',
    excludePatterns.join(', '),
    '\n',
  );

  const coveragePath = './coverage/apps/tia-frontend/coverage-final.json';

  if (fs.existsSync(coveragePath)) {
    console.log(`✅ Found coverage file at: ${coveragePath}\n`);
  }

  if (!coveragePath) {
    console.error('❌ Coverage file not found in any of these locations:');
    possiblePaths.forEach((path) => console.error(`   - ${path}`));
    console.error('\nPlease check your coverage output directory.');
    process.exit(1);
  }

  const coverageData = parseCoverageJson(coveragePath);
  const changedFiles = getChangedFiles();

  changedFiles.forEach((file) => console.log(`   - ${file}`));

  if (changedFiles.length === 0) {
    console.log('✅ No source files changed. Skipping coverage check.');
    process.exit(0);
  }

  console.log('📊 Checking coverage for changed files...\n');

  // Debug: show coverage file paths
  console.log('📁 Coverage files found:');
  Object.keys(coverageData)
    .slice(0, 5)
    .forEach((key) => console.log(`   ${key}`));
  // if (Object.keys(coverageData).length > 5) {
  //   console.log(`   ... and ${Object.keys(coverageData).length - 5} more\n`);
  // } else {
  //   console.log('');
  // }

  let failedFiles = [];
  let passedFiles = [];

  changedFiles.forEach((file) => {
    // First check if file should be excluded
    const isExcluded = isFileExcluded(file, excludePatterns);

    if (isExcluded) {
      console.log(`ℹ️  ${file} - Skipped (excluded in vitest config)`);
      return;
    }

    // Try to find the file in coverage data (normalize paths)
    // Match by filename or path segments
    const coverageFile = Object.keys(coverageData).find((key) => {
      const normalizedKey = key.replace(/\\/g, '/');
      const normalizedFile = file.replace(/\\/g, '/');

      // Check if paths match
      return (
        normalizedKey === normalizedFile ||
        normalizedKey.endsWith(normalizedFile) ||
        normalizedFile.endsWith(normalizedKey)
      );
    });

    if (!coverageFile) {
      // File not in coverage - missing spec file!

      // File should be in coverage but isn't - missing spec file!
      console.log(`❌ ${file} - Missing spec file or not tested`);
      failedFiles.push({ file, coverage: 0 });
      return;
    }

    // Check if spec file exists
    const specFilePath = file.replace(/\.ts$/, '.spec.ts');
    const specExists = fs.existsSync(specFilePath);

    if (!specExists) {
      console.log(`❌ ${file} - No corresponding .spec.ts file found`);
      failedFiles.push({ file, coverage: 0 });
      return;
    }

    const coverage = calculateCoverage(coverageData[coverageFile]);

    // Handle files with no executable statements
    if (coverage === null) {
      console.log(
        `ℹ️  ${file} - No executable statements (template-only component or types-only file)`,
      );
      // Don't fail for files with no statements, but they must be in coverage (have spec file)
      passedFiles.push({ file, coverage: 0 });
      return;
    }

    const status = coverage >= COVERAGE_THRESHOLD ? '✅' : '❌';

    if (coverage < COVERAGE_THRESHOLD) {
      failedFiles.push({ file, coverage });
    } else {
      passedFiles.push({ file, coverage });
    }
  });

  console.log('\n' + '='.repeat(60));
  console.log(
    `📈 Summary: ${passedFiles.length} passed, ${failedFiles.length} failed`,
  );
  console.log('='.repeat(60) + '\n');

  if (failedFiles.length > 0) {
    console.error(
      `❌ Coverage check failed! The following files have less than ${COVERAGE_THRESHOLD}% coverage:\n`,
    );
    failedFiles.forEach(({ file, coverage }) => {
      console.error(`   ${file}: ${coverage.toFixed(2)}%`);
    });
    console.error(
      `\n💡 Tip: Add tests for the changed/new code to reach ${COVERAGE_THRESHOLD}% coverage.\n`,
    );
    process.exit(1);
  }

  console.log(
    `✅ All changed files have at least ${COVERAGE_THRESHOLD}% coverage!\n`,
  );
  process.exit(0);
}

checkCoverage();
