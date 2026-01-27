const report = require('multiple-cucumber-html-reporter');

report.generate({
  jsonDir: 'reports',
  reportPath: 'reports/html',
  reportName: 'EGO Playwright Cucumber Report',
  pageTitle: 'Automation Test Report',
  displayDuration: true,
  metadata: {
    browser: {
      name: 'chrome',
      version: 'latest'
    },
    device: 'Local Machine',
    platform: {
      name: 'macOS',
      version: 'Sonoma'
    }
  }
});
