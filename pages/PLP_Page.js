const BasePage = require('../pages/BasePage');
const { expect } = require('@playwright/test');

class ProductListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    // Product tile selector
    this.productTile = '[data-testid="image-slot"]';

    // Load more button (if exists)
    this.loadMoreButton = '#pagination-next';
  }

  // Navigate to PLP and handle popup
  async navigateToPLP() {
    await this.page.goto('https://vsfstage.egoshoes.com/us/c/clothing', {
      waitUntil: 'domcontentloaded',
      timeout: 30000
    });
    await expect(this.page).toHaveURL(/\/clothing/);

    // Handle popup if present
    await this.closePopupIfPresent();

    // Wait for at least one product to appear
    await this.page.locator(this.productTile).first().waitFor({ state: 'visible', timeout: 10000 });
  }

  // Verify product tiles exist
  async verifyProductsVisible() {
    const products = this.page.locator(this.productTile);
    const count = await products.count();
    expect(count).toBeGreaterThan(0); // At least one product
  }

  // Click first product
  async openFirstProduct() {
    const firstProduct = this.page.locator(this.productTile).first();
    await firstProduct.waitFor({ state: 'visible', timeout: 10000 });
    await firstProduct.scrollIntoViewIfNeeded();
    await firstProduct.click(); // Navigate to PDP
  }

  async loadMoreProducts() {
    while (await this.page.locator(this.loadMoreButton).isVisible().catch(() => false)) {
      await this.page.locator(this.loadMoreButton).scrollIntoViewIfNeeded();
      await this.page.locator(this.loadMoreButton).click();
      await this.page.waitForTimeout(1000);
    }
  }
}

module.exports = ProductListingPage;
