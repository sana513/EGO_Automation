const { setWorldConstructor, BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const playwright = require("playwright");
const { getConfig, logConfig } = require("../../config/config");

setDefaultTimeout(3600000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.config = getConfig();
    this._cookieHandled = false;
  }

  get cookieHandled() { return this._cookieHandled; }
  set cookieHandled(val) { this._cookieHandled = val; }

  async attachScreenshot(name = "screenshot") {
    if (this.page && this.attach) {
      const screenshot = await this.page.screenshot({ fullPage: true });
      await this.attach(screenshot, "image/png");
    }
  }
}

setWorldConstructor(CustomWorld);

let browser;

BeforeAll(async function () {
  logConfig();
  const headless = process.env.HEADLESS === "true";

  const browserName = process.env.BROWSER || "webkit";
  const launch = playwright[browserName] || playwright.webkit;
  browser = await launch.launch({ headless: headless, slowMo: 100 });
});

AfterAll(async function () {
  await browser?.close();
});

Before(async function () {
  this.browser = browser;
  let viewport = { width: 1440, height: 900 };
  if (process.env.DISPLAY === "U2419H") {
    viewport = { width: 1920, height: 1080 };
  }

  this.context = await browser.newContext({
    viewport: viewport,
    recordVideo: { dir: "reports/videos/" },
    recordTrace: "retain-on-failure"
  });

  this.page = await this.context.newPage();
});


