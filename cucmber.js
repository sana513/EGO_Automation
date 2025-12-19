module.exports = {
  
  default: {
    require: [
      "features/step-definitions/*.js",
      "features/support/*.js"
    ],
    publishQuiet: true,
    format: ["progress"],
     
  }
};
