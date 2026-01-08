class BasePage {
  constructor(page) {
    this.page = page;

    // Define all popups/modal close buttons here
    this.popups = {
      closeModalBtn: this.page.locator('[aria-label="Close Modal"]'),
      declineOfferBtn: this.page.locator('button:has-text("Decline offer")'),
      button3: this.page.locator('#button3'),
    };
  }

  // Navigate to a URL
  async navigate(url) {
    await this.page.goto(url, {
      waitUntil: "domcontentloaded",
      timeout: 30000
    });

    // Give page a brief moment to settle
    await this.page.waitForTimeout(500);

    // Handle any popup if present
    await this.closePopupIfPresent();
  }

  // Close first visible popup
  async closePopupIfPresent() {
    for (const popup of Object.values(this.popups)) {
      if (await popup.isVisible().catch(() => false)) {
        await popup.click().catch(() => {});
        await this.page.waitForTimeout(500); // wait for animation/closing
        break; // only close the first visible popup
      }
    }
  }

  // Fill a form dynamically
  async fillForm(fields) {
    for (const selector in fields) {
      if (fields[selector] !== '') {
        await this.page.fill(selector, fields[selector]);
      }
    }
  }
}

module.exports = BasePage;
