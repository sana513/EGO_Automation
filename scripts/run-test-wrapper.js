const { execSync } = require('child_process');

const args = process.argv.slice(2);
const testType = args[0];
const additionalArgs = args.slice(1);

const testConfigs = {
  e2e: {
    feature: 'features/egoFeature.feature',
    tags: '@e2e'
  },
  login: {
    feature: 'features/loginFeature.feature',
    tags: '@login'
  },
  registration: {
    feature: 'features/signupFeature.feature',
    tags: '@registration'
  },
  homepage: {
    feature: 'features/homePageFeature.feature',
    tags: '@homepage'
  },
  plp: {
    feature: 'features/plpFeature.feature',
    tags: '@plp'
  },
  pdp: {
    feature: 'features/pdpFeature.feature',
    tags: '@pdp'
  },
  addtocart: {
    feature: 'features/addToCartFeature.feature',
    tags: '@addtocart'
  },
  checkout: {
    feature: 'features/checkoutFeature.feature',
    tags: '@checkout'
  },
  search: {
    feature: 'features/searchFeature.feature',
    tags: '@search'
  },
  logout: {
    feature: 'features/logoutFeature.feature',
    tags: '@logout'
  }
};

const config = testConfigs[testType];
if (!config) {
  console.error(`Unknown test type: ${testType}`);
  process.exit(1);
}

let command = `node scripts/run-test.js --feature=${config.feature} --tags=${config.tags} --headless=false --format json:reports/cucumber-report.json`;
if (additionalArgs.length > 0) {
  command += ' ' + additionalArgs.join(' ');
}

let testExitCode = 0;
try {
  execSync(command, {
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  // Tests failed, but we still want to generate the report
  testExitCode = error.status || 1;
  console.log('\n⚠️  Tests completed with failures. Generating report...\n');
}

// Always generate report, even if tests failed
try {
  execSync('node scripts/generate-report.js', {
    stdio: 'inherit',
    shell: true
  });
  console.log('\n✅ Report generated successfully!\n');
} catch (error) {
  console.error('\n❌ Failed to generate report:', error.message);
  // Don't exit here - we want to preserve the test exit code
}

// Exit with the test exit code (0 for success, non-zero for failure)
process.exit(testExitCode);
