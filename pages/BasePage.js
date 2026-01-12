const { expect } = require('@playwright/test');

class BasePage {
  constructor(page) {
    this.page = page;

    // Global modal locators
    this.modals = {
      modalRoot: this.page.locator('#layout'),
      closeButtons: this.page.locator(
        '#layout button[aria-label="Close Modal"], ' +
        '#layout button:has-text("Decline offer"), #button3'
      ),
    };
  }

  // Navigate to URL and handle modal if it appears
  async navigate(url) {
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.page.waitForTimeout(500); // brief pause
    await this.closeModalIfPresent();
  }

  // Close first visible modal globally
  async closeModalIfPresent() {
    if (await this.modals.modalRoot.isVisible({ timeout: 3000 }).catch(() => false)) {
      const count = await this.modals.closeButtons.count();
      for (let i = 0; i < count; i++) {
        const btn = this.modals.closeButtons.nth(i);
        if (await btn.isVisible().catch(() => false)) {
          await btn.click({ force: true });
          await this.modals.modalRoot.waitFor({ state: 'hidden', timeout: 3000 }).catch(() => {});
          break; // close only one modal at a time
        }
      }
    }
  }

  // Click safely, auto-handles modal
  async click(selector) {
    await this.closeModalIfPresent();
    await this.page.click(selector);
  }

  // Fill input safely, auto-handles modal
  async fill(selector, value) {
    await this.closeModalIfPresent();
    await this.page.fill(selector, value);
  }

  // Get text safely
  async getText(selector) {
    await this.closeModalIfPresent();
    return await this.page.textContent(selector);
  }

  // Wait for element safely
  async waitForSelector(selector, options = {}) {
    await this.closeModalIfPresent();
    return await this.page.waitForSelector(selector, options);
  }

  // Fill multiple form fields
  async fillForm(fields) {
    for (const selector in fields) {
      if (fields[selector] !== '') {
        await this.fill(selector, fields[selector]);
      }
    }
  }
}

module.exports = BasePage;
