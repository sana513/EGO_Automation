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

        await plp.navigateToPLP();

        await plp.loadMoreProducts();

        await plp.openFirstProduct();

    }

    async selectAnyAvailableSize() {
        console.log("🔹 Starting size selection...");

        // 1️⃣ Click "Select a Size" dropdown
        const sizeSelectorButton = this.page.locator(this.sizeSelectorButton).first();
        await sizeSelectorButton.waitFor({ state: 'visible', timeout: 10000 });
        await sizeSelectorButton.click();
        console.log("Clicked 'Select a Size' button");

        // 2️⃣ Get all size list items (not spans, to check parent element properly)
        const sizeListItems = this.page.locator('ul.select-options li');
        await sizeListItems.first().waitFor({ state: 'visible', timeout: 10000 });

        // 3️⃣ Filter out items with "Notify Me" and collect available sizes
        const count = await sizeListItems.count();
        const availableSizes = [];
        
        for (let i = 0; i < count; i++) {
            const listItem = sizeListItems.nth(i);
            // Get the full text content of the list item to check for "Notify Me"
            const itemText = await listItem.textContent();
            // Check if this list item contains "Notify Me" text
            const hasNotifyMe = itemText && itemText.includes('Notify Me');
            // Get the first span (which contains the size text like "US 02 (S)")
            const sizeSpan = listItem.locator('span').first();
            const sizeText = await sizeSpan.textContent();
            
            // Exclude items with "Notify Me", disabled items, or empty size text
            const disabled = await sizeSpan.getAttribute('disabled');
            
            if (!hasNotifyMe && !disabled && sizeText && sizeText.trim() !== '') {
                // Store the first span (size selector) for clicking
                availableSizes.push(sizeSpan);
                console.log(`✅ Found available size: ${sizeText.trim()}`);
            } else {
                console.log(`❌ Skipped size (Notify Me: ${hasNotifyMe}, Disabled: ${!!disabled}, Text: ${sizeText})`);
            }
        }

        if (availableSizes.length === 0) {
            throw new Error('No available size found (all sizes are "Notify Me" or disabled)');
        }

        // 4️⃣ Pick a random available size and click it
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

        const cart = this.page.locator(this.cartIcon);

        await cart.waitFor({ state: 'visible', timeout: 10000 });

        await cart.click();

    }

}

module.exports = ProductDetailPage;
