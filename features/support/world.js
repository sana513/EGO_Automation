const { setWorldConstructor, BeforeAll, AfterAll, Before, After, setDefaultTimeout } = require("@cucumber/cucumber");
const playwright = require("playwright");
const { getConfig, logConfig } = require("../../config/config");

setDefaultTimeout(3600000);

class CustomWorld {
  constructor() {
    this.browser = null;
    this.context = null;
    this.page = null;
    this.searchPage = null;
    this.config = getConfig();
    this.cookieHandled = false; // Instance-based state instead of global
  }

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
  browser = await launch.launch({ headless, slowMo: 50 });
});

AfterAll(async function () {
  await browser?.close();
});

Before(async function () {
  this.context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  this.page = await this.context.newPage();

  await this.page.evaluate(() => {
    const observer = new MutationObserver(() => {
      document.querySelectorAll('a[target="_blank"]').forEach(link => link.removeAttribute('target'));
    });
    observer.observe(document.body, { childList: true, subtree: true });
  });
});

After(async function (scenario) {
  if (scenario.result.status === "FAILED" && this.page) {
    const fs = require("fs");
    const path = require("path");
    const dir = "reports/screenshots";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const fileName = scenario.pickle.name.replace(/[^a-zA-Z0-9_-]/g, "_") + ".png";
    const filePath = path.join(dir, fileName);
    const screenshot = await this.page.screenshot({ fullPage: true });
    fs.writeFileSync(filePath, screenshot);
    if (this.attach) await this.attach(screenshot, "image/png");
  }

  await this.page?.close().catch(() => {});
  await this.context?.close().catch(() => {});
});
