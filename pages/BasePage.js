const { expect } = require('@playwright/test');

const ENV_CONFIG = {
  dev: {
    us: 'https://vsfdev.egoshoes.com/us',
    uk: 'https://vsfdev.ego.co.uk'
  },
  stage: {
    us: 'https://vsfstage.egoshoes.com/us',
    uk: 'https://vsfstage.ego.co.uk'
  },
  prod: {
    us: 'https://egoshoes.com/us',
    uk: 'https://ego.co.uk'
  }
};

class BasePage {
  constructor(page) {
    this.page = page;

    this.modals = {
      closeButtons: this.page.locator(
        'button[aria-label="Close Modal"], ' +
        'button:has-text("Decline offer"), #button3, ' +
        'button[aria-label="Close"], .fb_lightbox button.close, [class*="close-button"], ' +
        '.fb_lightbox-overlay, .preloaded_lightbox [aria-label="Close"]'
      )
    };
  }

  getBaseUrl(country = 'us') {
    const env = process.env.ENV || 'stage';
    const config = ENV_CONFIG[env] || ENV_CONFIG.stage;
    return config[country] || config.us;
  }

  async navigate(url) {
    const targetUrl = url || this.getBaseUrl();
    await this.page.goto(targetUrl, {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await this.page.waitForTimeout(500);
    await this.closeModalIfPresent();
  }

  async closeModalIfPresent() {
    const count = await this.modals.closeButtons.count();

    for (let i = 0; i < count; i++) {
      const button = this.modals.closeButtons.nth(i);
      if (await button.isVisible().catch(() => false)) {
        await button.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
      }
    }

    await this.page.evaluate(() => {
      const selectors = [
        '[id*="lightbox"]',
        '[class*="lightbox"]',
        '[class*="overlay-fixed"]',
        '[id*="sidebar-overlay"]',
        '.fb_lightbox',
        '.fb_lightbox-overlay'
      ];

      selectors.forEach(selector => {
        document.querySelectorAll(selector).forEach(element => {
          element.style.display = 'none';
        });
      });
    }).catch(() => {});
  }

  async click(selector) {
    await this.closeModalIfPresent();
    await this.page.click(selector);
  }

  async fill(selector, value) {
    await this.closeModalIfPresent();
    await this.page.fill(selector, value);
  }

  async getText(selector) {
    await this.closeModalIfPresent();
    return this.page.textContent(selector);
  }

  async waitForSelector(selector, options = {}) {
    await this.closeModalIfPresent();
    return this.page.waitForSelector(selector, options);
  }

  async fillForm(fields) {
    for (const selector in fields) {
      if (fields[selector] !== '') {
        await this.fill(selector, fields[selector]);
      }
    }
  }
}

module.exports = BasePage;
