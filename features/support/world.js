// features/support/world.js
const { setWorldConstructor, BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { webkit } = require("playwright");
const { getConfig, logConfig } = require("../../config/config");

setDefaultTimeout(3600000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.config = getConfig();
  }
}

setWorldConstructor(CustomWorld);

let browser;
let context;
let page;

BeforeAll(async function () {
  logConfig();
  const headless = process.env.HEADLESS === 'true';

  browser = await webkit.launch({ headless: headless, slowMo: 100 });
  context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
  page = await context.newPage();
});

AfterAll(async function () {
  await page?.close();
  await context?.close();
  await browser?.close();
});

Before(function () {
  this.browser = browser;
  this.context = context;
  this.page = page;
});

After(function () {
});