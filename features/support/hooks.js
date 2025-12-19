const { Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const { chromium } = require("playwright");

setDefaultTimeout(60000);

Before(async function () {
  this.browser = await chromium.launch({
    headless: false, // show the browser window
    slowMo: 100,     // slow down actions
  });

  this.context = await this.browser.newContext({
    viewport: { width: 1440, height: 900 },
  });

  this.page = await this.context.newPage();
  this.page.setDefaultTimeout(30000);
});

After(async function () {
  await this.page?.close();
  await this.context?.close();
  await this.browser?.close();
});
