const {expect} = require("@playwright/test");
const addToCartLocators = require("../locators/EGO_Locators").AddToCartLocators;

class AddToCartPage {
    constructor(page) {
        this.page = page;
    }

    async navigateToProductDetailPage() {
        await this.page.goto("https://vsfstage.egoshoes.com/us/p/cln1503-strappy-chainmail-drape-detail-corset-in-silver-satin/31975");
    }

    async clickSelectSizeButton() {
  const selectSize = this.page.locator(addToCartLocators.SELECT_SIZE_BUTTON).first();
  await selectSize.waitFor({ state: 'visible' });
  await selectSize.click();
}
    async selectSize() {
        await this.page.click(addToCartLocators.sizeOption);
    }

    async clickAddToBagButton() {
        await this.page.click(addToCartLocators.addToBagButton);
    }

    async verifyProductAddedToCart() {
        const cartCount = await this.page.textContent(addToCartLocators.cartItemCount);
        expect(cartCount).toBe("1");
    }
}

module.exports = AddToCartPage ;