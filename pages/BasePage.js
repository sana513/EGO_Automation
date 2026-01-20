const { expect } = require('@playwright/test');
const { getBaseUrl } = require('../config/config');
const { BaseLocators } = require('../locators/baseLocators');
const { testData } = require('../config/testData');

class BasePage {
  constructor(page) {
    this.page = page;
    this.modals = {
      closeButtons: this.page.locator(BaseLocators.modals.closeButtons.join(','))
    };
  }

  getBaseUrl(locale = null) {
    return getBaseUrl(null, locale);
  }

  async navigate(url) {
    const targetUrl = url || this.getBaseUrl();
    await this.page.goto(targetUrl, { waitUntil: 'domcontentloaded', timeout: testData.timeouts.extreme });
    await this.page.waitForTimeout(500);
    await this.closeModalIfPresent();
  }

  async closeModalIfPresent() {
    await this.handleCookieConsent();

    const count = await this.modals.closeButtons.count();
    for (let i = 0; i < count; i++) {
      const button = this.modals.closeButtons.nth(i);
      if (await button.isVisible().catch(() => false)) {
        await button.click({ force: true }).catch(() => { });
        await this.page.waitForTimeout(500);
      }
    }

    await this.page.evaluate((selectors) => {
      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => el.style.display = 'none');
      });
    }, BaseLocators.modals.overlays).catch(() => { });
  }

  async handleCookieConsent(timeout = 5000) {
    try {
      console.log('Checking for cookie banner...');
      for (const selector of BaseLocators.cookieConsent.acceptButtons) {
        const element = this.page.locator(selector).first();
        if (await element.isVisible({ timeout: 1000 }).catch(() => false)) {
          console.log(`Cookie banner found: ${selector}, clicking accept...`);
          await element.click({ force: true }).catch(() => { });
          await this.page.waitForTimeout(2000); // Wait for banner to start disappearing
          break;
        }
      }

      // Ensure overlays are removed even if button wasn't found or worked
      const overlayCount = await this.page.evaluate((overlays) => {
        let count = 0;
        overlays.forEach(sel => {
          document.querySelectorAll(sel).forEach(el => {
            el.style.display = 'none';
            el.style.visibility = 'hidden';
            el.style.pointerEvents = 'none';
            el.remove();
            count++;
          });
        });
        return count;
      }, BaseLocators.cookieConsent.overlays).catch(() => 0);

      if (overlayCount > 0) {
        console.log(`🧹 Removed ${overlayCount} cookie overlays/banners via scripts`);
      }

      // Secondary check for the specific problematic underlay
      const underlay = this.page.locator('#CybotCookiebotDialogBodyUnderlay');
      if (await underlay.isVisible({ timeout: 500 }).catch(() => false)) {
        console.log('⚠️ Underlay still visible, removing it specifically...');
        await underlay.evaluate(el => el.remove()).catch(() => { });
      }

      await this.page.waitForTimeout(1000);
    } catch (error) {
      console.log('⚠️ Error handling cookie consent:', error.message);
    }
  }

  async hover(target) {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await this.closeModalIfPresent();
        if (typeof target === 'string') {
          await this.page.hover(target, { timeout: 5000 });
        } else {
          await target.hover({ timeout: 5000 });
        }
        return;
      } catch (error) {
        if (error.message.includes('intercepts pointer events') && attempts < 2) {
          console.log(`⚠️ Hover intercepted, retrying modal closure (attempt ${attempts + 1})...`);
          await this.page.waitForTimeout(1000);
          attempts++;
        } else {
          throw error;
        }
      }
    }
  }

  async click(target) {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await this.closeModalIfPresent();
        if (typeof target === 'string') {
          await this.page.click(target, { timeout: 5000 });
        } else {
          await target.click({ timeout: 5000 });
        }
        return;
      } catch (error) {
        if (error.message.includes('intercepts pointer events') && attempts < 2) {
          console.log(`⚠️ Click intercepted, retrying modal closure (attempt ${attempts + 1})...`);
          await this.page.waitForTimeout(1000);
          attempts++;
        } else {
          throw error;
        }
      }
    }
  }

  async fill(target, value) {
    let attempts = 0;
    while (attempts < 3) {
      try {
        await this.closeModalIfPresent();
        if (typeof target === 'string') {
          await this.page.fill(target, value, { timeout: 5000 });
        } else {
          await target.fill(value, { timeout: 5000 });
        }
        return;
      } catch (error) {
        if (error.message.includes('intercepts pointer events') && attempts < 2) {
          console.log(`⚠️ Fill intercepted, retrying modal closure (attempt ${attempts + 1})...`);
          await this.page.waitForTimeout(1000);
          attempts++;
        } else {
          throw error;
        }
      }
    }
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
