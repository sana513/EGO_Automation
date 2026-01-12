const BasePage = require('../pages/BasePage');
const { expect } = require('@playwright/test');

class ProductListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.productTile = '[data-testid="image-slot"]';
    this.loadMoreButton = '#pagination-next';
  }

  async navigateToPLP(url = 'https://vsfstage.egoshoes.com/us') {
    await this.page.context().clearCookies();
    await this.page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    await this.closeModalIfPresent();

    // Select only visible category links (e.g. top level or currently open menu items)
    const categoryLinks = this.page.locator('nav a[href*="/c/"]:visible');
    await categoryLinks.first().waitFor();
    const count = await categoryLinks.count();

    if (count > 0) {
      const randomIndex = Math.floor(Math.random() * count);
      const selectedLink = categoryLinks.nth(randomIndex);
      console.log(`Clicking category link #${randomIndex}`);
      await selectedLink.hover(); // Hover first to ensure interactivity if it's a menu
      await selectedLink.click();
      await expect(this.page).toHaveURL(/\/c\//);
    } else {
      throw new Error("No visible category links found");
    }

    await this.closeModalIfPresent();

    await this.page.waitForFunction(
      (selector) => document.querySelectorAll(selector).length > 0,
      this.productTile
    );
  }

  async verifyProductsVisible() {
    const products = this.page.locator(this.productTile);
    const count = await products.count();
    expect(count).toBeGreaterThan(0);
  }

  async loadMoreProducts() {
    let previousCount = 0;

    while (true) {
      const currentCount = await this.page.locator(this.productTile).count();

      if (currentCount === previousCount) break;

      previousCount = currentCount;

      const loadMore = this.page.locator(this.loadMoreButton);
      if (!(await loadMore.isVisible().catch(() => false))) break;

      await loadMore.scrollIntoViewIfNeeded();
      await loadMore.click();

      await this.page.waitForFunction(
        (selector, count) =>
          document.querySelectorAll(selector).length > count,
        this.productTile,
        previousCount
      );
    }
  }

  async openFirstProduct() {
    const products = this.page.locator(this.productTile);
    const count = await products.count();
    if (count === 0) throw new Error("No products found on PLP");

    const randomIndex = Math.floor(Math.random() * count);
    const product = products.nth(randomIndex);
    await product.scrollIntoViewIfNeeded();

    await Promise.all([
      this.page.waitForURL(/\/p\//i),
      product.click()
    ]);
  }

  async openProductByIndex(index) {
    const products = this.page.locator(this.productTile);
    const count = await products.count();

    if (index >= count) throw new Error(`Index ${index} is out of bounds. Total products: ${count}`);

    const product = products.nth(index);
    await product.scrollIntoViewIfNeeded();


    await Promise.all([
      this.page.waitForURL(/\/p\//i),
      product.click()
    ]);
  }

}

module.exports = ProductListingPage;
