const { execSync } = require('child_process');

const args = process.argv.slice(2);
const testType = args[0];
const additionalArgs = args.slice(1);

const testConfigs = {
  e2e: {
    feature: 'features/e2eFeature.feature',
    tags: '@e2e'
  },
  login: {
    feature: 'features/loginFeature.feature',
    tags: '@login'
  },
  signup: {
    feature: 'features/signupFeature.feature',
    tags: '@signup'
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
  },
  fulljourney: {
    feature: 'features/e2e.feature',
    tags: '@full_journey'
  }
};

const config = testConfigs[testType];
if (!config) {
  console.error(`Unknown test type: ${testType}`);
  process.exit(1);
}

// Check if additional args contain tags
let finalTags = config.tags;
let otherArgs = [];

for (let i = 0; i < additionalArgs.length; i++) {
  const arg = additionalArgs[i];
  if (arg.startsWith('--tags')) {
    let additionalTag;
    if (arg.includes('=')) {
      additionalTag = arg.split('=')[1].replace(/['"]/g, '');
    } else {
      additionalTag = additionalArgs[i + 1];
      if (additionalTag) {
        additionalTag = additionalTag.replace(/['"]/g, '');
        i++; // Skip next arg since we used it
      }
    }
    if (additionalTag && !additionalTag.startsWith('--')) {
      // Combine tags with AND logic
      finalTags = `"${config.tags} and ${additionalTag}"`;
    }
  } else {
    otherArgs.push(arg);
  }
}

let command = `node scripts/run-test.js --feature=${config.feature} --tags=${finalTags} --headless=false --format json:reports/cucumber-report.json`;
if (otherArgs.length > 0) {
  command += ' ' + otherArgs.join(' ');
}

let testExitCode = 0;
try {
  execSync(command, {
    stdio: 'inherit',
    shell: true
  });
} catch (error) {
  testExitCode = error.status || 1;
  console.log('\nTests completed with failures. Generating report...\n');
}

try {
  execSync('node scripts/generate-report.js', {
    stdio: 'inherit',
    shell: true
  });
  console.log('\nReport generated successfully!\n');
} catch (error) {
  console.error('\nFailed to generate report:', error.message);
}

process.exit(testExitCode);
