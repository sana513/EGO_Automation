const { getBaseUrl } = require('../config/config');
const { BaseLocators } = require('../locators/baseLocators');
const { testData } = require('../config/testData');
const { waitForNetworkSettled, settle } = require('../utils/dynamicWait');

class BasePage {
  constructor(page) {
    this.page = page;
    this.modalButtons = page.locator(BaseLocators.modals.closeButtons.join(','));
  }

  getBaseUrl(locale = null) {
    return getBaseUrl(null, locale);
  }

  async navigate(url) {
    await this.page.goto(url || this.getBaseUrl(), {
      waitUntil: 'load',
      timeout: testData.timeouts.extreme
    });
    await this.closeModalIfPresent(true);
  }

  async closeModalIfPresent(isInitial = false) {
    const url = this.page.url();
    const isUK = /\/(uk|eu)|\.co\.uk/.test(url);
    
    if (isUK && (isInitial || !global.cookieHandled)) {
      await this.handleCookieConsent(isInitial);
    } else if (isUK) {
      await this.hideOverlays(BaseLocators.cookieConsent.overlays);
      const underlay = this.page.locator('#CybotCookiebotDialogBodyUnderlay');
      if (await underlay.isVisible({ timeout: 300 }).catch(() => false)) {
        await underlay.evaluate(el => el.remove()).catch(() => { });
      }
    }

    const count = await this.modalButtons.count();
    for (let i = 0; i < count; i++) {
      const btn = this.modalButtons.nth(i);
      if (await btn.isVisible().catch(() => false)) {
        await btn.click({ force: true }).catch(() => { });
        await settle(this.page, 150);
      }
    }

    await this.hideOverlays(BaseLocators.modals.overlays);
  }

  async handleCookieConsent(isInitial = false) {
    try {
      const url = this.page.url();
      const isUK = /\/(uk|eu)|\.co\.uk/.test(url);
      
      if (!isUK) {
        global.cookieHandled = true;
        return;
      }

      const consentGiven = await this.page.evaluate(() => {
        if (localStorage.getItem('CookieConsent') || 
            localStorage.getItem('cookiebot-consent') ||
            localStorage.getItem('cookieconsent_status')) {
          return true;
        }
        const cookies = document.cookie.split(';');
        for (const cookie of cookies) {
          const [name] = cookie.trim().split('=');
          if (name.includes('CookieConsent') || 
              name.includes('cookiebot') ||
              name.includes('cookieconsent')) {
            return true;
          }
        }
        return false;
      }).catch(() => false);

      if (consentGiven) {
        await this.hideOverlays(BaseLocators.cookieConsent.overlays);
        const underlay = this.page.locator('#CybotCookiebotDialogBodyUnderlay');
        if (await underlay.isVisible({ timeout: 500 }).catch(() => false)) {
          await underlay.evaluate(el => el.remove()).catch(() => { });
        }
        global.cookieHandled = true;
        return;
      }

      if (global.cookieHandled) {
        return;
      }

      let accepted = false;
      for (const sel of BaseLocators.cookieConsent.acceptButtons) {
        const btn = this.page.locator(sel).first();
        const timeout = isInitial ? 8000 : 2000;
        if (await btn.isVisible({ timeout }).catch(() => false)) {
          await btn.click({ force: true }).catch(() => { });
          await settle(this.page, 800);
          
          await this.page.waitForFunction(() => {
            return localStorage.getItem('CookieConsent') || 
                   localStorage.getItem('cookiebot-consent') ||
                   document.cookie.includes('CookieConsent') ||
                   document.cookie.includes('cookiebot');
          }, { timeout: 5000 }).catch(() => {});
          
          await this.page.waitForLoadState('load', { timeout: 10000 }).catch(() => { });
          accepted = true;
          break;
        }
      }

      if (accepted) {
        await this.page.evaluate(() => {
          localStorage.setItem('CookieConsent', 'true');
          localStorage.setItem('cookiebot-consent', 'true');
          document.cookie = 'CookieConsent=true; path=/; max-age=31536000';
          document.cookie = 'cookiebot-consent=true; path=/; max-age=31536000';
        });
        global.cookieHandled = true;
      }
      await this.hideOverlays(BaseLocators.cookieConsent.overlays);

      const underlay = this.page.locator('#CybotCookiebotDialogBodyUnderlay');
      if (await underlay.isVisible({ timeout: 500 }).catch(() => false)) {
        await underlay.evaluate(el => el.remove()).catch(() => { });
      }
    } catch (e) {
      await this.hideOverlays(BaseLocators.cookieConsent.overlays).catch(() => {});
    }
  }

  async ensureHomeAndReady(locale = null) {
    const currentLocale = locale || process.env.LOCALE || 'us';
    const isUK = ['uk', 'eu'].includes(currentLocale);
    
    await this.navigate(this.getBaseUrl(currentLocale));
    
    if (isUK) {
      await this.handleCookieConsent(true);
      await this.page.waitForLoadState('load', { timeout: 15000 }).catch(() => {});
      await settle(this.page, 1000);
    }
    
    await waitForNetworkSettled(this.page, isUK ? 15000 : 10000);
    await this.closeModalIfPresent();
    
    if (isUK) {
      await settle(this.page, 500);
    }
    
    await this.page.evaluate(() => window.scrollTo(0, 0));
  }

  async hideOverlays(selectors = []) {
    await this.page.evaluate(sels => {
      sels.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.style.pointerEvents = 'none';
          el.remove();
        })
      );
    }, selectors).catch(() => { });
  }

  resolve(target) {
    return typeof target === 'string' ? this.page.locator(target) : target;
  }

  async retryAction(action, target, value) {
    for (let i = 0; i < 3; i++) {
      try {
        await this.closeModalIfPresent();
        const el = this.resolve(target);

        if (action === 'fill') await el.fill(value, { timeout: 5000 });
        else if (action === 'hover') await el.hover({ timeout: 5000 });
        else await el.click({ timeout: 5000 });

        return;
      } catch (e) {
        if (!e.message.includes('intercepts pointer events') || i === 2) throw e;
        await settle(this.page, 500);
      }
    }
  }

  async click(target) {
    await this.retryAction('click', target);
  }

  async hover(target) {
    await this.retryAction('hover', target);
  }

  async fill(target, value) {
    await this.retryAction('fill', target, value);
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
    for (const [selector, value] of Object.entries(fields)) {
      if (value !== '') await this.fill(selector, value);
    }
  }
}

module.exports = BasePage;
