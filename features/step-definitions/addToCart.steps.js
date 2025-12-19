const {expect} = require("@playwright/test");
const {Given, When, Then} = require("@cucumber/cucumber");
const AddToCartPage = require("../../pages/AddToCartPgae");

let addToCartPage = new AddToCartPage(this.page);

Given("the user is on the product detail page", async function () {
    addToCartPage = new AddToCartPage(this.page);
    await addToCartPage.navigateToProductDetailPage();
});
When("the user clicks on the \"Select a Size\" button", async function () {
    await addToCartPage.clickSelectSizeButton();
});
When("the user selects a size from the available options", async function () {
    await addToCartPage.selectSize();
});
When("the user clicks on the \"Add to Bag\" button", async function () {
    await addToCartPage.clickAddToBagButton();
});
Then("the product should be added to the shopping cart", async function () {
    await addToCartPage.verifyProductAddedToCart();
});
