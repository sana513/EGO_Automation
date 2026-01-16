const { expect } = require('@playwright/test');
const { getBaseUrl } = require('../config/config');
const { CommonLocators } = require('../locators/EGO_Locators');

class BasePage {
  constructor(page) {
    this.page = page;
    this.modals = {
      closeButtons: this.page.locator(CommonLocators.modals.closeButtons.join(','))
    };
  }

  getBaseUrl(locale = null) {
    return getBaseUrl(null, locale);
  }

  async navigate(url) {
    const targetUrl = url || this.getBaseUrl();
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(500);
    await this.closeModalIfPresent();
  }

  async closeModalIfPresent() {
    await this.handleCookieConsent();

    const count = await this.modals.closeButtons.count();
    for (let i = 0; i < count; i++) {
      const button = this.modals.closeButtons.nth(i);
      if (await button.isVisible().catch(() => false)) {
        await button.click({ force: true }).catch(() => {});
        await this.page.waitForTimeout(500);
      }
    }

    await this.page.evaluate((selectors) => {
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
      });
    }, CommonLocators.modals.overlays).catch(() => {});
  }

  async handleCookieConsent() {
    try {
      for (const selector of CommonLocators.cookieConsent.acceptButtons) {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 500 }).catch(() => false)) {
          await element.click({ force: true }).catch(() => {});
          await this.page.waitForTimeout(500);
          break;
        }
      }

      await this.page.evaluate((overlays) => {
        overlays.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.remove();
          });
        });
      }, CommonLocators.cookieConsent.overlays).catch(() => {});
    } catch {}
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
