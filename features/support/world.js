// features/support/world.js
const { setWorldConstructor, BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { webkit } = require("playwright");

setDefaultTimeout(60000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
  }
}

setWorldConstructor(CustomWorld);

let browser;
let context;
let page;

BeforeAll(async function () {
  // Launch browser once for all scenarios
  browser = await webkit.launch({ headless: false, slowMo: 1200 });
  context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  page = await context.newPage();
});

AfterAll(async function () {
  // Close browser once after all scenarios
  // await page?.close();
  // await context?.close();
  // await browser?.close();
});

Before(function () {
  // Attach the shared page to the world for each scenario
  this.browser = browser;
  this.context = context;
  this.page = page;
});

After(function () {
  // Do nothing, keep browser open
});