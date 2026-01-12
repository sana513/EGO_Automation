const { setDefaultTimeout } = require("@cucumber/cucumber");

setDefaultTimeout(60000);

// Browser launch/close is handled in world.js
// This file keeps timeout configuration if needed