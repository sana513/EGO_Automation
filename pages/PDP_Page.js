const BasePage = require('./BasePage');

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

        const sizeOptions = this.page.locator('ul.select-options li span');
        await sizeOptions.first().waitFor({ state: 'visible', timeout: 10000 });

        // 3️⃣ Filter enabled options and pick random
        const count = await sizeOptions.count();
        const availableSizes = [];
        for (let i = 0; i < count; i++) {
            const size = sizeOptions.nth(i);
            const disabled = await size.getAttribute('disabled'); // likely undefined for enabled
            const text = await size.textContent();

            // Exclude Notify Me or empty values
            if (!disabled && text && !text.includes('Notify Me')) {
                availableSizes.push(size);
            }
        }

        if (availableSizes.length === 0) throw new Error('No available size found');

        const randomSize = availableSizes[Math.floor(Math.random() * availableSizes.length)];
        await randomSize.scrollIntoViewIfNeeded();
        await randomSize.click();
    }

    async addToBag() {

        const addBtn = this.page.locator(this.addToBagButton).first();

        await addBtn.waitFor({ state: 'visible', timeout: 10000 });

        await addBtn.click();

    }

    async openCart() {

        const cart = this.page.locator(this.cartIcon);

        await cart.waitFor({ state: 'visible', timeout: 10000 });

        await cart.click();

    }

}

module.exports = ProductDetailPage;

