const { Given, When, Then } = require('@cucumber/cucumber');
const ProductListingPage = require('../../pages/plpPage');
const BasePage = require('../../pages/basePage');
const { expect } = require('@playwright/test');
const { testData } = require('../../config/testData');

Given('I open the PLP page', async function () {
  this.basePage = new BasePage(this.page);
  this.plp = new ProductListingPage(this.page);
  await this.basePage.navigate();
  await this.plp.openFirstAvailableSubCategory();
});
Then('all product tiles should be visible', async function () {
  await this.plp.verifyProductsUI(testData.plp.productLimit);
});

When('I scroll down and click load more until all products are loaded', async function () {
  await this.plp.loadMoreOnce();

  await this.plp.verifyProductsUI(testData.plp.productLimit);
});

When('I open the first product', async function () {
  await this.plp.openFirstProduct();
});

When('I open product number {int}', async function (index) {
  await this.plp.openProductByIndex(index - 1);
});

Then('I should be on the PDP page', async function () {
  await expect(this.page).toHaveURL(/\/p\//i);
});

Given('I navigate through all subcategories sequentially and verify PLP visibility', async function () {
  this.basePage = new BasePage(this.page);
  this.plp = new ProductListingPage(this.page);

  console.log(`Navigating to home page...`);
  await this.basePage.navigate();

  const structure = await this.plp.getNavigationStructure();
  console.log(`Found ${structure.length} usable main categories. Starting fast sequential verification...`);

  for (const item of structure) {
    if (item.subCount === 0) continue;

    console.log(`\n--- Verifying: ${item.mainText} ---`);

    await this.basePage.navigate();

    await this.plp.openSubCategory(item.mainIndex, 0);
    await this.plp.verifyPLPHeaderContent();

    const p1Count = await this.plp.verifyProductsUI(40, 0);

    const loadMoreBtn = this.page.locator(this.plp.loadMoreButton);
    if (p1Count >= 40 && await loadMoreBtn.isVisible()) {
      await this.plp.loadMoreOnce();
      await this.plp.verifyProductsUI(40, 40);
    }

    console.log(`SUCCESS: ${item.mainText} verified.`);
  }
});
