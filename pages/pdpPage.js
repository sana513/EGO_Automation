const BasePage = require('./basePage');
const { expect } = require('@playwright/test');
const ProductListingPage = require('./plpPage');
const { pdpLocators } = require('../locators/pdpLocators');
const { testData } = require('../config/testData');

class ProductDetailPage extends BasePage {

    constructor(page) {
        super(page);
        this.page = page;

        this.sizeSelectorButton = pdpLocators.sizeSelectorButton;
        this.addToBagButton = pdpLocators.addToBagButton;
        this.cartIcon = pdpLocators.cartIcon;
    }

    async openRandomProductFromPLP() {
        const plp = new ProductListingPage(this.page);
        await plp.openFirstAvailableSubCategory();
        await plp.loadMoreOnce();
        await plp.openFirstProduct();
    }

    async selectAnyAvailableSize() {
        console.log("Starting size selection...");
        const sizeSelectorButton = this.page.locator(this.sizeSelectorButton).first();
        await sizeSelectorButton.waitFor({ state: 'visible', timeout: testData.timeouts.large });
        await sizeSelectorButton.click();

        console.log("Clicked 'Select a Size' button");

        const sizeListItems = this.page.locator(pdpLocators.sizeOptions);
        await sizeListItems.first().waitFor({ state: 'visible', timeout: testData.timeouts.large });

        const count = await sizeListItems.count();
        const availableSizes = [];

        for (let i = 0; i < count; i++) {
            const listItem = sizeListItems.nth(i);
            const itemText = await listItem.textContent();
            const hasNotifyMe = itemText && itemText.includes(testData.pdp.labels.notifyMe);
            const sizeSpan = listItem.locator(pdpLocators.sizeSpan).first();
            const sizeText = await sizeSpan.textContent();
            const disabled = await sizeSpan.getAttribute('disabled');

            if (!hasNotifyMe && !disabled && sizeText && sizeText.trim() !== '') {
                availableSizes.push(sizeSpan);
            }
        }

        if (availableSizes.length === 0) {
            throw new Error('No available size found (all sizes are "Notify Me" or disabled)');
        }

        const randomIndex = Math.floor(Math.random() * availableSizes.length);
        const randomSize = availableSizes[randomIndex];
        const selectedSizeText = await randomSize.textContent();
        console.log(`Selected size: ${selectedSizeText}`);

        await randomSize.scrollIntoViewIfNeeded();
        await randomSize.click();
    }

    async addToBag() {
        const addBtn = this.page.locator(this.addToBagButton).first();
        await addBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
        await addBtn.click();
        await this.page.waitForTimeout(2000);
    }

    async openCart() {
        await this.closeModalIfPresent();
        await this.page.waitForTimeout(500);

        const cart = this.page.locator(this.cartIcon);
        await cart.waitFor({ state: 'visible', timeout: testData.timeouts.large });
        try {
            await cart.click({ timeout: 5000 });
        } catch (error) {
            await this.closeModalIfPresent();
            await cart.click({ force: true });
        }

        await this.page.waitForTimeout(1000);
    }
}

module.exports = ProductDetailPage;
