const { Given, When, Then } = require('@cucumber/cucumber');
const AddToCartPage = require('../../pages/AddToCartPgae');

Given('I open a random product from PLP', async function () {
  this.addToCart = new AddToCartPage(this.page);
  await this.addToCart.openRandomProduct();
});

When('I select any available size', async function () {
  await this.addToCart.pdp.selectAnyAvailableSize();
});

When('I add the product to the bag', async function () {
  await this.addToCart.pdp.addToBag();
});

Then('I open the cart page', async function () {
  await this.addToCart.openCart();
});
When('I update the quantity randomly', async function () {
  await this.addToCart.updateQuantityRandomly();
});

When('I update the product size randomly', async function () {
  await this.addToCart.updateSizeRandomly();
});
When('I add the product to wishlist', async function () {
  await this.addToCart.addProductToWishlist();
});

When('I apply the coupon code {string}', async function (code) {
  await this.addToCart.applyCoupon(code);
});

When('I proceed to checkout', async function () {
  await this.addToCart.proceedToCheckout();
});
