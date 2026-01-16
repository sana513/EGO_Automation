const BasePage = require('../pages/BasePage');

const { expect } = require('@playwright/test');

const ProductListingPage = require('../pages/PLP_Page');

class ProductDetailPage extends BasePage {

    constructor(page) {

        super(page);

        this.page = page;


        this.sizeSelectorButton = 'span:has-text("Select a Size")';
        // this.sizeOptions = '[data-testid="size-selector"] li span';
        this.addToBagButton = '[data-testid="add-to-bag"]';
        this.cartIcon = '[id="Bag icon_2"]';


    }

    // PLP → PDP (dynamic)

    async openRandomProductFromPLP() {
        const plp = new ProductListingPage(this.page);
        await plp.openFirstAvailableSubCategory();
        await plp.loadMoreOnce();
        await plp.openFirstProduct();
    }

    async selectAnyAvailableSize() {
        console.log("🔹 Starting size selection...");
        const sizeSelectorButton = this.page.locator(this.sizeSelectorButton).first();
        await sizeSelectorButton.waitFor({ state: 'visible', timeout: 10000 });
        await sizeSelectorButton.click();
        console.log("Clicked 'Select a Size' button");
        const sizeListItems = this.page.locator('ul.select-options li');
        await sizeListItems.first().waitFor({ state: 'visible', timeout: 10000 });
        const count = await sizeListItems.count();
        const availableSizes = [];

        for (let i = 0; i < count; i++) {
            const listItem = sizeListItems.nth(i);
            const itemText = await listItem.textContent();
            const hasNotifyMe = itemText && itemText.includes('Notify Me');
            const sizeSpan = listItem.locator('span').first();
            const sizeText = await sizeSpan.textContent();
            const disabled = await sizeSpan.getAttribute('disabled');

            if (!hasNotifyMe && !disabled && sizeText && sizeText.trim() !== '') {
                availableSizes.push(sizeSpan);
                console.log(`✅ Found available size: ${sizeText.trim()}`);
            } else {
                console.log(`❌ Skipped size (Notify Me: ${hasNotifyMe}, Disabled: ${!!disabled}, Text: ${sizeText})`);
            }
        }

        if (availableSizes.length === 0) {
            throw new Error('No available size found (all sizes are "Notify Me" or disabled)');
        }

        const randomIndex = Math.floor(Math.random() * availableSizes.length);
        const randomSize = availableSizes[randomIndex];
        const selectedSizeText = await randomSize.textContent();

        console.log(`🎯 Selecting random size: ${selectedSizeText.trim()}`);
        await randomSize.scrollIntoViewIfNeeded();
        await randomSize.click();
        console.log(`✅ Successfully selected size: ${selectedSizeText.trim()}`);
    }

    async addToBag() {

        const addBtn = this.page.locator(this.addToBagButton).first();

        await addBtn.waitFor({ state: 'visible', timeout: 1000 });

        await addBtn.click();
        await this.page.waitForTimeout(2000);

    }

    async openCart() {
        await this.closeModalIfPresent();
        await this.page.waitForTimeout(500);

        const cart = this.page.locator(this.cartIcon);
        await cart.waitFor({ state: 'visible', timeout: 10000 });
        try {
            await cart.click({ timeout: 5000 });
        } catch (error) {
            console.log('Cart click blocked, trying with force...');
            await this.closeModalIfPresent();
            await cart.click({ force: true });
        }

        await this.page.waitForTimeout(1000);
    }

}

module.exports = ProductDetailPage;
