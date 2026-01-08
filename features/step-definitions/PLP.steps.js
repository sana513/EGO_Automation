const { Given, When, Then } = require('@cucumber/cucumber');
const ProductListingPage = require('../../pages/PLP_Page');
const { expect } = require('@playwright/test');

Given('I open the PLP page', async function () {
  this.plp = new ProductListingPage(this.page);
  await this.plp.navigateToPLP();
});

Then('all product tiles should be visible', async function () {
  await this.plp.verifyProductsVisible();
});

When('I scroll down and click load more until all products are loaded', async function () {
  await this.plp.loadMoreProducts();
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
