const BasePage = require('../basePage');
const ProductListingPage = require('../plpPage');
const SearchPage = require('../searchPage');
const MultiSizeProductPage = require('./multiSizeProductPage');
const { pdpLocators } = require('../../locators/pdpLocators');
const { AddToCartLocators } = require('../../locators/addToCartLocators');
const { testData } = require('../../config/testData');
const { pdpLabels } = require('../../config/egoLabels');
const { pdpLogs } = require('../../config/egoLogs');
const { PDP_WAIT_TIMES } = require('../../config/constants');
const { waitForNetworkSettled, settle } = require('../../utils/dynamicWait');
const { getRandomElement } = require('../../features/support/utils');

class ProductDetailPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;

        this.sizeSelectorButton = pdpLocators.sizeSelectorButton;
        this.addToBagButton = pdpLocators.addToBagButton;
        this.cartIcon = pdpLocators.cartIcon;
        this.outOfStockTitle = pdpLocators.outOfStockTitle;

        this.pdpConfig = testData.pdp;
        this.logs = pdpLogs;
        this.waits = PDP_WAIT_TIMES;
        this.labels = pdpLabels;
    }

    // ---------------------- Open Product from PLP ----------------------
    async openRandomProductFromPLP() {
        const plp = new ProductListingPage(this.page);

        for (let categoryAttempt = 0; categoryAttempt < this.pdpConfig.maxCategoryRetries; categoryAttempt++) {
            console.log(`${this.logs.categoryAttempt} ${categoryAttempt + 1}/${this.pdpConfig.maxCategoryRetries}`);
            await this.ensureHomeAndReady();
            await plp.openFirstAvailableSubCategory();
            await plp.loadMoreOnce();

            for (let productAttempt = 0; productAttempt < this.pdpConfig.maxProductRetries; productAttempt++) {
                console.log(`  ${this.logs.productAttempt} ${productAttempt + 1}/${this.pdpConfig.maxProductRetries}`);

                await plp.openRandomProduct();
                await settle(this.page, this.waits.productSettle);

                if (await this.isProductAvailable()) {
                    console.log(this.logs.productAvailable);
                    return;
                }

                console.warn(`  ${this.logs.productUnavailable}`);
                await this.page.goBack({ waitUntil: 'domcontentloaded' }).catch(() => { });
                await settle(this.page, this.waits.backNavSettle);
            }

            console.warn(this.logs.noCategoryProducts);
        }

        throw new Error(`${this.logs.failedFindProduct} ${this.pdpConfig.maxCategoryRetries} categories and ${this.pdpConfig.maxProductRetries} products per category`);
    }


    // ---------------------- Open Product from Search ----------------------
    async openRandomProductFromSearch(keyword) {
        if (!keyword) {
            keyword = getRandomElement(testData.search.keywords.randomKeywords);
        }
        const search = new SearchPage(this.page);

        for (let attempt = 0; attempt < this.pdpConfig.maxSearchRetries; attempt++) {
            console.log(`${this.logs.searchAttempt} ${attempt + 1}/${this.pdpConfig.maxSearchRetries} for keyword: ${keyword}`);
            await this.ensureHomeAndReady();
            await search.performSearch(keyword);
            await search.openProductFromResultByIndex(Math.floor(Math.random() * this.pdpConfig.maxSearchIndex));

            if (await this.isProductAvailable()) {
                console.log(this.logs.searchProductAvailable);
                return;
            }
            console.warn(this.logs.searchProductOOS);
            await this.page.goBack().catch(() => { });

            keyword = getRandomElement(testData.search.keywords.randomKeywords);
        }
        throw new Error(`${this.logs.failedSearchProduct} ${this.pdpConfig.maxSearchRetries} attempts`);
    }

    // ---------------------- Check Product Availability ----------------------
    async isProductAvailable() {
        console.log(`  ${this.logs.checkingAvailability}`);
        await settle(this.page, this.waits.productSettle);

        const pageText = await this.page.textContent('body').catch(() => '');
        const lowerPageText = pageText.toLowerCase();

        for (const msg of this.pdpConfig.oosMessages) {
            if (lowerPageText.includes(msg)) {
                console.warn(`  ${this.logs.foundOOSMessage} "${msg}"`);
                return false;
            }
        }

        const sizeBtn = this.page.locator(this.sizeSelectorButton).first();
        const addBtn = this.page.locator(this.addToBagButton).first();

        const available = await Promise.race([
            sizeBtn.waitFor({ state: 'visible', timeout: this.waits.productVisible }).then(() => true).catch(() => false),
            addBtn.waitFor({ state: 'visible', timeout: this.waits.productVisible }).then(() => true).catch(() => false)
        ]);

        if (!available) {
            console.warn(`  ${this.logs.noButtonsAppeared}`);
            return false;
        }

        const btnText = await addBtn.textContent().catch(() => '');
        if (btnText.toLowerCase().includes(this.labels.soldOut) ||
            btnText.toLowerCase().includes(this.labels.outOfStock) ||
            btnText.toLowerCase().includes(this.labels.notifyMe.toLowerCase())) {
            console.warn(`  ${this.logs.productOOSButton} "${btnText.trim()}"`);
            return false;
        }

        console.log(`  ${this.logs.productInStock}`);
        return true;
    }
    // ---------------------- Select Available Size ----------------------
    async selectAnyAvailableSize() {
        console.log(this.logs.selectingAvailableSize);

        const sizeSelector = this.page.locator(this.sizeSelectorButton).first();
        const visible = await sizeSelector.isVisible({ timeout: 5000 }).catch(() => false);

        if (!visible) {
            const addBtn = this.page.locator(this.addToBagButton).first();
            if (await addBtn.isVisible()) {
                console.log(this.logs.oneSizeDetected);
                return;
            }
            throw new Error(this.logs.sizeNotFoundMulti);
        }

        const multiSizePage = new MultiSizeProductPage(this.page);
        await multiSizePage.selectRandomSize();
    }

    // ---------------------- Add Product to Bag ----------------------
    async addToBag() {
        const addBtn = this.page.locator(this.addToBagButton).first();

        await addBtn.waitFor({
            state: 'visible',
            timeout: testData.timeouts.medium
        });

        await addBtn.click();

        await waitForNetworkSettled(this.page, 5000);
        await settle(this.page, 300);

        console.log(this.logs.productAddedToBag);
    }

    // ---------------------- Open Cart ----------------------
    async openCart() {
        await this.closeModalIfPresent();
        await settle(this.page, 200);

        const cart = this.page.locator(this.cartIcon);
        await cart.waitFor({ state: 'visible', timeout: testData.timeouts.large });

        try {
            await cart.click({ timeout: 5000 });
        } catch {
            await this.closeModalIfPresent();
            await cart.click({ force: true });
        }

        const onCartPage = await Promise.race([
            this.page.waitForURL(/\/cart/i, { timeout: testData.timeouts.medium }).then(() => true),
            this.page.locator(AddToCartLocators.Update_quantity).first().waitFor({ state: 'visible', timeout: testData.timeouts.medium }).then(() => true)
        ]).catch(() => false);

        if (!onCartPage) {
            const currentUrl = this.page.url();
            const base = new URL(currentUrl).origin;
            const cartUrl = `${base}/cart`;
            await this.page.goto(cartUrl, { waitUntil: 'domcontentloaded', timeout: testData.timeouts.medium }).catch(() => { });
            await this.page.locator(AddToCartLocators.Update_quantity).first().waitFor({ state: 'visible', timeout: testData.timeouts.medium }).catch(() => { });
        }

        await settle(this.page, 200);
        console.log(this.logs.cartPageOpened);
    }
}

module.exports = ProductDetailPage;