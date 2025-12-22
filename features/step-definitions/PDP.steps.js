const { Given, When, Then } = require('@cucumber/cucumber');
const ProductDetailPage = require('../../pages/PDP_Page');

let pdp;

Given('I open a random product from PLP', async function () {
  pdp = new ProductDetailPage(this.page);
  await pdp.openRandomProductFromPLP();  // Navigate PLP → PDP
});

When('I select any available size', async function () {
  await pdp.selectAnyAvailableSize();    // Clicks first available size dynamically
});

When('I add the product to the bag', async function () {
  await pdp.addToBag();                  // Handles multiple add-to-bag buttons
});

Then('I open the cart page', async function () {
  await pdp.openCart();                  // Opens cart icon
});
