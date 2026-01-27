module.exports = {
  default: {
    require: [
      "features/step-definitions/**/*.js",
      "features/support/world.js",
      "features/support/hooks.js"
    ],
    publishQuiet: true,
    format: [
      "progress",                     
      "json:reports/cucumber-report.json" 
    ]
  }
};
