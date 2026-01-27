const { setWorldConstructor, BeforeAll, AfterAll, Before, setDefaultTimeout } = require("@cucumber/cucumber");
const playwright = require("playwright");
const { getConfig, logConfig } = require("../../config/config");

setDefaultTimeout(3600000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.config = getConfig();
  }

  get cookieHandled() { return global.cookieHandled; }
  set cookieHandled(val) { global.cookieHandled = val; }

  async attachScreenshot(name = "screenshot") {
    if (this.page && this.attach) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, "image/png");
    }
  }
}

setWorldConstructor(CustomWorld);

let browser;
let context;
let page;

BeforeAll(async function () {
  logConfig();
  const headless = process.env.HEADLESS === "true";
  global.cookieHandled = false;

  const browserName = process.env.BROWSER || "webkit";
  const launch = playwright[browserName] || playwright.webkit;
  browser = await launch.launch({ headless: headless, slowMo: 100 });
  context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: "reports/videos/" },
    recordTrace: "retain-on-failure"
  });
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
