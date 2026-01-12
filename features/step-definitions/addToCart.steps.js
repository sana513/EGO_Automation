const { Given, When, Then } = require('@cucumber/cucumber');
const AddToCartPage = require('../../pages/AddToCartPgae');

let addToCart;

Given('I open the website for {string}', async function (region) {
  addToCart = new AddToCartPage(this.page);

  let url;
  switch (region.toLowerCase()) {
    case 'us': url = 'https://vsfstage.egoshoes.com/us/'; break;
    case 'uk': url = 'https://vsfstage.egoshoes.com/uk/'; break;
    default: throw new Error(`Unknown region: ${region}`);
  }

  await addToCart.navigate(url);
});

Given('I open a random product from PLP', async function () {
  await addToCart.openRandomProduct();
});

When('I select any available size', async function () {
  await addToCart.pdp.selectAnyAvailableSize();
});

When('I add the product to the bag', async function () {
  await addToCart.pdp.addToBag();
});

Then('I open the cart page', async function () {
  await addToCart.openCart();
});
When('I update the quantity randomly', async function () {
  await addToCart.updateQuantityRandomly();
});

When('I update the product size randomly', async function () {
  await addToCart.updateSizeRandomly();
}); 
When('I add the product to wishlist', async function () {
  await addToCart.addProductToWishlist();
});

When('I apply the coupon code {string}', async function (code) {
  await addToCart.applyCoupon(code);
});

When('I proceed to checkout', async function () {
  await addToCart.proceedToCheckout();
});
