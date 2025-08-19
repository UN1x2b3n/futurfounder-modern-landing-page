#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function runCommand(command, args = [], options = {}) {
  return new Promise((resolve, reject) => {
    const child = spawn(command, args, {
      stdio: 'inherit',
      shell: true,
      ...options,
    });

    child.on('close', (code) => {
      if (code === 0) {
        resolve(code);
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });

    child.on('error', (error) => {
      reject(error);
    });
  });
}

async function runTestSuite() {
  log('\n🧪 Starting Comprehensive Test Suite', colors.bright + colors.cyan);
  log('=' .repeat(50), colors.cyan);

  const testSuites = [
    {
      name: 'Unit Tests',
      description: 'Testing all reusable components',
      command: 'npx',
      args: ['vitest', 'run', 'components/__tests__/TestSuite.test.tsx', '--reporter=verbose'],
      icon: '🔧',
    },
    {
      name: 'Accessibility Tests',
      description: 'Screen reader compatibility and keyboard navigation',
      command: 'npx',
      args: ['vitest', 'run', 'components/__tests__/accessibility/', '--reporter=verbose'],
      icon: '♿',
    },
    {
      name: 'Visual Regression Tests',
      description: 'Responsive breakpoints and visual consistency',
      command: 'npx',
      args: ['vitest', 'run', 'components/__tests__/visual/', '--reporter=verbose'],
      icon: '👁️',
    },
    {
      name: 'Performance Tests',
      description: 'Page load times and performance optimization',
      command: 'npx',
      args: ['vitest', 'run', 'components/__tests__/performance/', '--reporter=verbose'],
      icon: '⚡',
    },
    {
      name: 'Integration Tests',
      description: 'Form submission and navigation functionality',
      command: 'npx',
      args: ['vitest', 'run', 'components/__tests__/integration/', '--reporter=verbose'],
      icon: '🔗',
    },
  ];

  const results = [];
  let totalTests = 0;
  let passedTests = 0;
  let failedTests = 0;

  for (const suite of testSuites) {
    log(`\n${suite.icon} Running ${suite.name}`, colors.bright + colors.blue);
    log(`   ${suite.description}`, colors.blue);
    log('-'.repeat(40), colors.blue);

    try {
      const startTime = Date.now();
      await runCommand(suite.command, suite.args);
      const endTime = Date.now();
      const duration = endTime - startTime;

      results.push({
        name: suite.name,
        status: 'PASSED',
        duration,
        icon: '✅',
      });

      log(`   ✅ ${suite.name} completed in ${duration}ms`, colors.green);
      passedTests++;
    } catch (error) {
      results.push({
        name: suite.name,
        status: 'FAILED',
        error: error.message,
        icon: '❌',
      });

      log(`   ❌ ${suite.name} failed: ${error.message}`, colors.red);
      failedTests++;
    }

    totalTests++;
  }

  // Run coverage report
  log('\n📊 Generating Coverage Report', colors.bright + colors.magenta);
  log('-'.repeat(40), colors.magenta);

  try {
    await runCommand('npx', ['vitest', 'run', '--coverage', '--reporter=verbose']);
    log('   ✅ Coverage report generated', colors.green);
  } catch (error) {
    log(`   ⚠️  Coverage report failed: ${error.message}`, colors.yellow);
  }

  // Print summary
  log('\n📋 Test Suite Summary', colors.bright + colors.cyan);
  log('=' .repeat(50), colors.cyan);

  results.forEach((result) => {
    const statusColor = result.status === 'PASSED' ? colors.green : colors.red;
    const duration = result.duration ? ` (${result.duration}ms)` : '';
    log(`${result.icon} ${result.name}: ${result.status}${duration}`, statusColor);
    
    if (result.error) {
      log(`   Error: ${result.error}`, colors.red);
    }
  });

  log(`\nTotal: ${totalTests} | Passed: ${passedTests} | Failed: ${failedTests}`, colors.bright);

  if (failedTests === 0) {
    log('\n🎉 All tests passed! The comprehensive test suite is complete.', colors.bright + colors.green);
    log('\n✅ Requirements validated:', colors.green);
    log('   • Unit tests for all reusable components', colors.green);
    log('   • Visual regression tests for responsive breakpoints', colors.green);
    log('   • Accessibility tests for screen reader compatibility', colors.green);
    log('   • Performance tests ensuring page load times under 3 seconds', colors.green);
    log('   • Integration tests for form submission and navigation', colors.green);
  } else {
    log(`\n❌ ${failedTests} test suite(s) failed. Please review the errors above.`, colors.bright + colors.red);
    process.exit(1);
  }
}

// Handle command line arguments
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  log('\n🧪 Comprehensive Test Suite Runner', colors.bright + colors.cyan);
  log('\nUsage: node run-tests.js [options]', colors.cyan);
  log('\nOptions:', colors.cyan);
  log('  --help, -h     Show this help message', colors.cyan);
  log('  --watch, -w    Run tests in watch mode', colors.cyan);
  log('  --coverage, -c Run only coverage report', colors.cyan);
  log('\nTest Categories:', colors.cyan);
  log('  • Unit Tests: All reusable components', colors.cyan);
  log('  • Accessibility: Screen reader & keyboard navigation', colors.cyan);
  log('  • Visual Regression: Responsive breakpoints', colors.cyan);
  log('  • Performance: Page load times & optimization', colors.cyan);
  log('  • Integration: Form submission & navigation', colors.cyan);
  process.exit(0);
}

if (args.includes('--watch') || args.includes('-w')) {
  log('\n🔄 Running tests in watch mode...', colors.bright + colors.yellow);
  runCommand('npx', ['vitest', '--watch']).catch(() => process.exit(1));
} else if (args.includes('--coverage') || args.includes('-c')) {
  log('\n📊 Running coverage report only...', colors.bright + colors.magenta);
  runCommand('npx', ['vitest', 'run', '--coverage']).catch(() => process.exit(1));
} else {
  runTestSuite().catch((error) => {
    log(`\n💥 Test suite runner failed: ${error.message}`, colors.bright + colors.red);
    process.exit(1);
  });
}