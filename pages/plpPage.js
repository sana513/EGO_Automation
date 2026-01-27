const BasePage = require('./basePage');
const { expect } = require('@playwright/test');
const { PLPLocators } = require('../locators/plpLocators');
const { testData } = require('../config/testData');
const { settle } = require('../utils/dynamicWait');

class ProductListingPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;

    this.pageTitle = PLPLocators.pageTitle;
    this.pageDescription = PLPLocators.pageDescription;

    this.productTile = PLPLocators.productTile;
    this.productTitle = PLPLocators.productTitle;
    this.productPrice = PLPLocators.productPrice;
    this.productImage = PLPLocators.productImage;
    this.wishlistIcon = PLPLocators.wishlistIcon;

    this.loadMoreButton = PLPLocators.loadMoreButton;

    this.mainCategoryLinks = PLPLocators.mainCategoryLinks;
    this.subCategoryLinks = PLPLocators.subCategoryLinks;
  }

  async waitForPLP(timeout = testData.timeouts.extreme) {
    await this.page.waitForSelector(this.productTile, { timeout });
  }

  async verifyPLPHeaderContent() {
    await expect(this.page.locator(this.pageTitle)).toBeVisible();

    const description = this.page.locator(this.pageDescription).first();
    if (await description.isVisible()) {
      await expect(description).not.toBeEmpty();
    }
  }

  async verifyProductsUI(limit = 40, startIndex = 0) {
    const products = this.page.locator(this.productTile);
    const count = await products.count();

    if (count <= startIndex) {
      console.warn(
        `Requested start index ${startIndex} but only ${count} products found. Skipping.`
      );
      return 0;
    }

    const verifyLimit = Math.min(count - startIndex, limit);
    console.log(`Verifying ${verifyLimit} products starting from index ${startIndex}`);

    await products.nth(startIndex).scrollIntoViewIfNeeded();
    await products.nth(startIndex + verifyLimit - 1).scrollIntoViewIfNeeded();

    for (let i = startIndex; i < startIndex + verifyLimit; i++) {
      const product = products.nth(i);

      await Promise.all([
        expect(product).toBeVisible(),
        expect(product.locator(this.productImage)).toBeVisible(),
        expect(product.locator(this.productTitle)).toBeVisible(),
        expect(product.locator(this.productPrice).first()).toBeVisible(),
        expect(product.locator(this.wishlistIcon)).toBeVisible()
      ]);

      if ((i + 1) % 10 === 0) {
        console.log(`Verified ${i + 1} products`);
      }
    }

    return verifyLimit;
  }

  async loadMoreOnce() {
    const loadMore = this.page.locator(this.loadMoreButton);
    if (!(await loadMore.isVisible().catch(() => false))) return;

    const beforeCount = await this.page.locator(this.productTile).count();
    await this.closeModalIfPresent();
    await loadMore.click({ force: true });

    try {
      await this.page.waitForFunction(
        ({ selector, count }) =>
          document.querySelectorAll(selector).length > count,
        { selector: this.productTile, count: beforeCount },
        { timeout: testData.timeouts.huge }
      );
      await settle(this.page, 200);
    } catch {
      console.warn('No additional products loaded');
    }
  }

  async openFirstAvailableSubCategory() {
    const currentLocale = process.env.LOCALE || 'us';
    const isUK = ['uk', 'eu'].includes(currentLocale);
    
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await settle(this.page, 300);
    await this.closeModalIfPresent();
    
    if (isUK) {
      await settle(this.page, 1000);
    }

    const mainCategories = this.page.locator(this.mainCategoryLinks);
    
    let mainCount = 0;
    for (let retry = 0; retry < 5; retry++) {
      mainCount = await mainCategories.count();
      if (mainCount > 0) break;
      if (retry < 4) {
        console.warn(`No main categories found, retry ${retry + 1}/5...`);
        await settle(this.page, 800);
        await this.closeModalIfPresent();
      }
    }

    if (mainCount === 0) {
      throw new Error('No main categories found after 5 retries. Page may not be fully loaded.');
    }

    for (let i = 0; i < mainCount; i++) {
      const mainCat = mainCategories.nth(i);
      const catText = await mainCat.textContent().catch(() => '');

      console.log(`Checking category ${i}: ${catText}`);

      await this.closeModalIfPresent();
      await mainCat.scrollIntoViewIfNeeded();
      await settle(this.page, 200);
      await this.hover(mainCat);
      await settle(this.page, isUK ? 600 : 400);

      const subCategories = this.page
        .locator(this.subCategoryLinks)
        .filter({ visible: true })
        .filter({ hasNotText: testData.plp.subCategoryFilterIgnore })
        .filter({
          has: this.page.locator('xpath=self::*[contains(@href, "/c/")]')
        });

      await subCategories.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await settle(this.page, 300);

      const subCount = await subCategories.count();
      if (subCount > 0) {
        console.log(`Found ${subCount} subcategories in "${catText}"`);
        await subCategories.first().click({ force: true });
        await this.waitForPLP();
        return; 
      }
    }

    throw new Error('No visible subcategories found in any main category');
  }

  async openFirstProduct() {
    const products = this.page.locator(this.productTile);
    if (!(await products.count())) {
      throw new Error('No products found on PLP');
    }

    await Promise.all([
      this.page.waitForURL(/\/p\//i),
      products.first().click()
    ]);
  }

  async openProductByIndex(index) {
    const products = this.page.locator(this.productTile);
    const count = await products.count();

    if (index >= count) {
      throw new Error(`Index ${index} out of bounds. Total products: ${count}`);
    }

    await Promise.all([
      this.page.waitForURL(/\/p\//i),
      products.nth(index).click()
    ]);
  }

  async openRandomProduct() {
    const products = this.page.locator(this.productTile);
    const count = await products.count();

    if (!count) {
      throw new Error('No products found on PLP');
    }

    const randomIndex = Math.floor(Math.random() * count);
    console.log(`Opening random product at index ${randomIndex} of ${count}`);

    await Promise.all([
      this.page.waitForURL(/\/p\//i),
      products.nth(randomIndex).click()
    ]);
  }

  async openSubCategory(mainIndex = 0, subIndex = 0) {
    const mainCategories = this.page.locator(this.mainCategoryLinks);
    if (!(await mainCategories.count())) {
      throw new Error('No main categories found');
    }

    const mainCat = mainCategories.nth(mainIndex);
    const mainText = (await mainCat.textContent()).trim();
    const maxAttempts = 3;

    const getSubCategories = () =>
      this.page
        .locator(this.subCategoryLinks)
        .filter({ visible: true })
        .filter({ hasNotText: testData.plp.subCategoryFilterIgnore })
        .filter({
          has: this.page.locator('xpath=self::*[contains(@href, "/c/")]')
        });

    const ensureNavReady = async () => {
      await this.page.evaluate(() => window.scrollTo(0, 0));
      await settle(this.page, 150);
      await this.closeModalIfPresent();
      await settle(this.page, 200);
      await mainCat.scrollIntoViewIfNeeded();
      await settle(this.page, 150);
    };

    let subCount = 0;
    let subCategories;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      console.log(`Hovering over main category: ${mainText} (attempt ${attempt}/${maxAttempts})`);
      await ensureNavReady();
      await this.hover(mainCat);

      await settle(this.page, 400);
      subCategories = getSubCategories();
      await subCategories.first().waitFor({ state: 'visible', timeout: 3000 }).catch(() => {});
      await settle(this.page, 300);

      subCount = await subCategories.count();
      console.log(`Found ${subCount} visible subcategories`);

      if (subCount > 0) break;

      if (attempt < maxAttempts) {
        console.warn(`No subcategories for "${mainText}". Retrying...`);
        await settle(this.page, 400);
      }
    }

    if (subCount === 0) {
      throw new Error(`No visible subcategories found for "${mainText}" after ${maxAttempts} attempts. The menu may not have loaded properly.`);
    }

    if (subIndex >= subCount) {
      throw new Error(`Subcategory index ${subIndex} out of bounds`);
    }

    const subCat = subCategories.nth(subIndex);
    const subText = (await subCat.textContent().catch(() => 'Unknown')).trim();
    const href = await subCat.getAttribute('href').catch(() => 'none');

    console.log(`Clicking subcategory: ${subText} (${href})`);

    await subCat.click({ force: true });
    await this.waitForPLP();
  }

  async getNavigationStructure() {
    const currentLocale = process.env.LOCALE || 'us';
    const isUK = ['uk', 'eu'].includes(currentLocale);
    
    await this.page.evaluate(() => window.scrollTo(0, 0));
    await settle(this.page, 300);
    await this.closeModalIfPresent();
    await settle(this.page, isUK ? 1000 : 300);

    const mainCategories = this.page.locator(this.mainCategoryLinks);
    
    let mainCount = 0;
    for (let retry = 0; retry < 5; retry++) {
      mainCount = await mainCategories.count();
      if (mainCount > 0) break;
      if (retry < 4) {
        await settle(this.page, 800);
        await this.closeModalIfPresent();
      }
    }

    if (mainCount === 0) {
      throw new Error('No main categories found for navigation structure');
    }

    const structure = [];

    for (let i = 0; i < mainCount; i++) {
      const mainCat = mainCategories.nth(i);
      const text = (await mainCat.textContent()).trim();
      if (!text) continue;

      await mainCat.scrollIntoViewIfNeeded();
      await settle(this.page, 200);
      await this.hover(mainCat);
      await settle(this.page, isUK ? 500 : 300);

      const subCategories = this.page
        .locator(this.subCategoryLinks)
        .filter({ visible: true })
        .filter({ hasNotText: testData.plp.subCategoryFilterIgnore })
        .filter({
          has: this.page.locator('xpath=self::*[contains(@href, "/c/")]')
        });

      await subCategories.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
      await settle(this.page, 200);

      structure.push({
        mainIndex: i,
        mainText: text,
        subCount: await subCategories.count()
      });
    }

    return structure;
  }
}

module.exports = ProductListingPage;
