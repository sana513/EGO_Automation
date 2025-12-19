const { Given, When, Then } = require('@cucumber/cucumber');
const ProductListingPage = require('../../pages/PLP_Page');


Given('the user is on the product listing page', async function () {
  this.plp = new ProductListingPage(this.page);
  await this.plp.navigateToPLP();
});

Then('product tiles should be visible', async function () {
  await this.plp.verifyProductsVisible();
});

When('the user clicks on the first product', async function () {
  await this.plp.openFirstProduct();
});

When('the user scrolls down and clicks load more until all products are loaded', async function () {
  await this.plp.loadMoreProducts();
});
