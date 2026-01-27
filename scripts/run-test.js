const { execSync } = require('child_process');

const args = process.argv.slice(2);
let env = 'stage';
let locale = 'us';
let headless = 'true';
let featureFile = '';
let tags = '';
let format = '';
for (let i = 0; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--env=')) {
        env = arg.split('=')[1];
    } else if (arg.startsWith('--locale=')) {
        locale = arg.split('=')[1];
    } else if (arg.startsWith('--headless=')) {
        headless = arg.split('=')[1];
    } else if (arg.startsWith('--feature=')) {
        featureFile = arg.split('=')[1];
    } else if (arg.startsWith('--tags=')) {
        tags = arg.split('=')[1];
    } else if (arg.startsWith('--format=')) {
        format = arg.split('=')[1];
    }
}

console.log(`\n Running tests with:`);
console.log(`   Environment: ${env}`);
console.log(`   Locale:      ${locale}`);
console.log(`   Headless:    ${headless}`);
console.log(`   Feature:     ${featureFile}`);
console.log(`   Tags:        ${tags || 'none'}\n`);

let command = `npx cross-env ENV=${env} LOCALE=${locale} HEADLESS=${headless} npx cucumber-js ${featureFile} --require "features/step-definitions/*.js" --require features/support/world.js --require features/support/hooks.js`;

if (tags) {
    command += ` --tags ${tags}`;
}

if (format) {
    command += ` --format ${format}`;
}

try {
    execSync(command, {
        stdio: 'inherit',
        shell: true
    });
} catch (error) {
    process.exit(error.status || 1);
}
