const BasePage = require('./basePage');
const { expect } = require('@playwright/test');
const ProductListingPage = require('./plpPage');
const SearchPage = require('./searchPage');
const { pdpLocators } = require('../locators/pdpLocators');
const { AddToCartLocators } = require('../locators/addToCartLocators');
const { testData } = require('../config/testData');
const { waitForNetworkSettled, settle } = require('../utils/dynamicWait');

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
        const maxRetries = 3;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            console.log(`Open Random Product Attempt ${attempt + 1}/${maxRetries}`);
            await this.ensureHomeAndReady();
            await plp.openFirstAvailableSubCategory();
            await plp.loadMoreOnce();
            await plp.openRandomProduct();

            if (await this.isProductAvailable()) {
                console.log("Product is available.");
                return;
            }
            console.warn("Product is Out of Stock or invalid. Retrying...");
            await this.page.goBack().catch(() => { });
        }
        throw new Error(`Failed to find an available random product after ${maxRetries} attempts`);
    }

    async openRandomProductFromSearch(keyword) {
        if (!keyword) {
            const keys = testData.search.keywords.randomKeywords;
            keyword = keys[Math.floor(Math.random() * keys.length)];
        }
        const search = new SearchPage(this.page);
        const maxRetries = 3;

        for (let attempt = 0; attempt < maxRetries; attempt++) {
            console.log(`Search Product Attempt ${attempt + 1}/${maxRetries} for keyword: ${keyword}`);
            await this.ensureHomeAndReady();
            await search.performSearch(keyword);
            await search.openProductFromResultByIndex(Math.floor(Math.random() * 5));

            if (await this.isProductAvailable()) {
                console.log("Product from search is available.");
                return;
            }
            console.warn("Product from search is Out of Stock. Retrying...");
            await this.page.goBack().catch(() => { });

            // Pick a new search term for the retry to increase chances
            const keys = testData.search.keywords.randomKeywords;
            keyword = keys[Math.floor(Math.random() * keys.length)];
        }
        throw new Error(`Failed to find an available search product after ${maxRetries} attempts`);
    }

    async isProductAvailable() {
        console.log("Checking product availability...");
        await settle(this.page, 1000);

        const sizeBtn = this.page.locator(this.sizeSelectorButton).first();
        const addBtn = this.page.locator(this.addToBagButton).first();

        const available = await Promise.race([
            sizeBtn.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false),
            addBtn.waitFor({ state: 'visible', timeout: 5000 }).then(() => true).catch(() => false)
        ]);

        if (!available) {
            console.warn("Neither size selector nor Add to Bag button appeared.");
            return false;
        }

        const btnText = await addBtn.textContent().catch(() => "");
        if (btnText.toLowerCase().includes('sold out') ||
            btnText.toLowerCase().includes('out of stock') ||
            btnText.toLowerCase().includes('notify me')) {
            console.warn(`Product is OOS. Button text: "${btnText.trim()}"`);
            return false;
        }

        return true;
    }

    async openProductFromPLPByIndex(index) {
        await this.ensureHomeAndReady();

        const plp = new ProductListingPage(this.page);
        await plp.openFirstAvailableSubCategory();
        await this.closeModalIfPresent();
        await plp.loadMoreOnce();
        await plp.openProductByIndex(index);
    }

    async selectAnyAvailableSize() {
        console.log("Starting size selection...");
        const sizeSelectorButton = this.page.locator(this.sizeSelectorButton).first();
        const isSizeSelectorVisible = await sizeSelectorButton.isVisible({ timeout: 5000 }).catch(() => false);

        if (!isSizeSelectorVisible) {
            const addBtn = this.page.locator(this.addToBagButton).first();
            if (await addBtn.isVisible()) {
                console.log("No size selector found, but 'Add to Bag' is visible. Assuming One Size product.");
                return;
            }
            throw new Error("Size selector not found and 'Add to Bag' is also not visible.");
        }

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
            console.warn("No available sizes found in the dropdown.");
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
        await waitForNetworkSettled(this.page, 5000);
        await settle(this.page, 300);
    }

    async openCart() {
        await this.closeModalIfPresent();
        await settle(this.page, 200);

        const cart = this.page.locator(this.cartIcon);
        await cart.waitFor({ state: 'visible', timeout: testData.timeouts.large });
        try {
            await cart.click({ timeout: 5000 });
        } catch (error) {
            await this.closeModalIfPresent();
            await cart.click({ force: true });
        }

        const onCartPage = await Promise.race([
            this.page.waitForURL(/\/cart/i, { timeout: testData.timeouts.medium }).then(() => true),
            this.page.locator(AddToCartLocators.Update_quantity).first().waitFor({ state: 'visible', timeout: testData.timeouts.medium }).then(() => true)
        ]).catch(() => false);

        if (!onCartPage) {
            const base = this.getBaseUrl().replace(/\/?$/, '');
            const cartUrl = `${base}/cart`;
            await this.page.goto(cartUrl, { waitUntil: 'domcontentloaded', timeout: testData.timeouts.medium }).catch(() => { });
            await this.page.locator(AddToCartLocators.Update_quantity).first().waitFor({ state: 'visible', timeout: testData.timeouts.medium }).catch(() => { });
        }
        await settle(this.page, 200);
    }
}

module.exports = ProductDetailPage;