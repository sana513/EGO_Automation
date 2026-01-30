const { getConfig } = require('./config/config');

module.exports = {
  testDir: 'tests',
  timeout: 60000,
  use: {
    baseURL: getConfig().baseUrl,
    viewport: null
  }
};
