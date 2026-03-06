const { expect } = require('@playwright/test');
const { CheckoutLocators } = require('../../locators/checkoutLocators');
const BasePage = require('../basePage');
const AddToCartPage = require('../addToCartPage');
const { testData } = require('../../config/testData');
const { TIMEOUTS, CHECKOUT_WAIT_TIMES } = require('../../config/constants');
const { checkoutLogs } = require('../../config/egoLogs');
const { checkoutLabels } = require('../../config/egoLabels');
const { settle, clickWhenReady, safeFill } = require('../../utils/dynamicWait');
const { getRandomIndex } = require('../../features/support/utils');
const PaymentMethods = require('../paymentMethods/payByCard');

class CheckoutPage extends BasePage {
    constructor(page) {
        super(page);
        this.page = page;
        this.config = testData.checkout;
        this.locators = CheckoutLocators;
        this.timeouts = TIMEOUTS;
        this.waits = CHECKOUT_WAIT_TIMES;
        this.logs = checkoutLogs;
        this.labels = checkoutLabels;
        this.addToCartPage = new AddToCartPage(page);
        this.paymentMethods = new PaymentMethods(page, this.locators, this.config, this.timeouts);
    }

    /**
     * Clicks the continue button on shipping address form
     * Waits for navigation to shipping method or payment step
     * @returns {Promise<void>}
     */
    async clickShippingContinue() {
        await clickWhenReady(this.page, this.locators.shipping.continueToShippingMethod, this.timeouts.large);
        await this.page.waitForURL(new RegExp('shipping-method|payment', 'i'), { timeout: this.timeouts.large });
        console.log(this.logs.movedToNextStep);
    }

    /**
     * Selects a shipping method from available options
     * If multiple methods available, selects one randomly
     * @returns {Promise<void>}
     */
    async selectShippingMethod() {
        console.log(this.logs.selectingShippingMethod);
        const methods = await this.page.locator(this.locators.shippingMethodRadio).all();
        if (methods.length === 1) await methods[0].click({ force: true });
        else if (methods.length > 1) await methods[getRandomIndex(methods.length)].click({ force: true });
        else console.warn(this.logs.noShippingMethods);
        await settle(this.page, this.waits.shippingMethodSelection);
    }

    async continueToPayment() {
        await this.stableAction(this.locators.shippingMethodContinue, 'click', null, { timeout: this.timeouts.large });
        await settle(this.page, this.waits.paymentStepLoad);
        console.log(this.logs.navigatedToPayment);
    }

    /**
     * Fills payment card details in the checkout form
     * Handles multiple payment iframe types (Checkout.com, Stripe, BigCommerce)
     * @param {Object} card - Card details object
     * @param {string} card.number - Card number
     * @param {string} card.expiry - Expiry date (MM/YY format)
     * @param {string} card.cvc - Card security code
     * @param {string} card.name - Cardholder name
     * @returns {Promise<void>}
     */
    async fillCardDetails(card) {
        await this.closeModalIfPresent();
        await this.paymentMethods.fillCardDetails(card);
    }

    async clickPayNow() {
        // Check for and click terms and conditions checkbox if present
        const termsCheckbox = this.page.locator(this.locators.termsCheckbox);
        const termsVisible = await termsCheckbox.isVisible({ timeout: 3000 }).catch(() => false);

        if (termsVisible) {
            const isChecked = await termsCheckbox.isChecked();
            if (!isChecked) {
                console.log(this.logs.clickingTerms);
                // Use force click since label intercepts pointer events
                await termsCheckbox.click({ force: true });
                await settle(this.page, 500);
                console.log(this.logs.termsAccepted);
            } else {
                console.log(this.logs.termsAlreadyChecked);
            }
        }

        await this.stableAction(this.locators.payNowButton, 'click', null, { timeout: this.timeouts.medium });
        await settle(this.page, 2000);
        console.log(this.logs.payNowClicked);

        // Handle 3D Secure authentication if present
        await this.handle3DSecure();
    }

    async handle3DSecure() {
        console.log(this.logs.checking3DS);
        await settle(this.page, 5000);

        // Check if we're on 3DS authentication page by URL or title
        let currentUrl = this.page.url().toLowerCase();
        let currentTitle = (await this.page.title()).toLowerCase();

        const is3DSPage = this.labels.threeDSecure.urlKeywords.some(kw => currentUrl.includes(kw.toLowerCase())) ||
            this.labels.threeDSecure.titleKeywords.some(kw => currentTitle.includes(kw.toLowerCase()));

        if (is3DSPage) {
            console.log(`${this.logs.dsPageDetected} ${currentUrl}, Title: ${currentTitle}`);

            // Wait for page to fully load through redirects
            console.log(this.logs.waiting3DSLoad);
            await this.page.waitForLoadState('networkidle', { timeout: 20000 }).catch(() => { });
            await settle(this.page, 5000);

            // Update URL and title after redirects
            currentUrl = this.page.url();
            currentTitle = await this.page.title();
            console.log(`${this.logs.final3DSPage} ${currentUrl}, Title: ${currentTitle}`);

            let frameContext = null;
            for (const iframeSelector of this.locators.threeDSecure.iframes) {
                const iframe = this.page.locator(iframeSelector).first();
                const iframeExists = await iframe.count() > 0;

                if (iframeExists) {
                    console.log(`${this.logs.iframeFound} ${iframeSelector}`);
                    frameContext = await iframe.contentFrame();

                    if (frameContext) {
                        console.log(this.logs.gotIframeContext);
                        break;
                    }
                }
            }

            // If iframe found, work within iframe context, otherwise use main page
            const context = frameContext || this.page;

            let inputFound = false;
            for (const selector of this.locators.threeDSecure.inputs) {
                const input = context.locator(selector).first();
                const isVisible = await input.isVisible({ timeout: 2000 }).catch(() => false);

                if (isVisible) {
                    console.log(`${this.logs.inputFieldFound} ${selector}`);

                    const secureCode = this.labels.threeDSecure.secureCode;
                    await input.fill(secureCode);
                    console.log(`${this.logs.enteredSecureCode} ${secureCode}`);

                    await settle(this.page, 1000);

                    // Look for submit button in same context
                    let submitBtnClicked = false;
                    for (const btnSelector of this.locators.threeDSecure.submitButtons) {
                        const btn = context.locator(btnSelector).first();
                        if (await btn.isVisible({ timeout: 1000 }).catch(() => false)) {
                            await btn.click();
                            submitBtnClicked = true;
                            break;
                        }
                    }

                    if (submitBtnClicked) {
                        console.log(this.logs.submitted3DS);
                        inputFound = true;
                    }
                    break;
                }
            }

            if (!inputFound) {
                console.log(this.logs.inputNotFound);
            }

            // Wait for navigation back to order confirmation
            await this.page.waitForLoadState('networkidle', { timeout: 30000 }).catch(() => { });
            await settle(this.page, 3000);
            console.log(this.logs.authCompleted);
        } else {
            console.log(this.logs.noAuthRequired);
        }
    }

    async verifyOrderConfirmation() {
        await this.page.waitForLoadState('networkidle', { timeout: this.timeouts.medium }).catch(() => { });
        if (!this.config.regex.confirmationPage.test(this.page.url())) {
            await expect(this.page).toHaveTitle(new RegExp(this.config.expectedTitles.confirmation, 'i'));
        }
        console.log(this.logs.orderConfirmed);
    }

    /**
     * Selects province/state from dropdown or fills input field
     * Handles both select dropdowns and text inputs
     * @param {string} provinceFromData - Province/state code (e.g., 'NY', 'ON')
     * @returns {Promise<void>}
     */
    async selectProvince(provinceFromData) {
        console.log(this.logs.provinceStabilize);
        await settle(this.page, this.waits.provinceStabilize);

        let dropdown = null;
        let foundSelector = null;

        for (const selector of this.locators.provinceSelectors) {
            const element = this.page.locator(selector).first();
            if (await element.isVisible({ timeout: this.timeouts.small }).catch(() => false)) {
                dropdown = element;
                foundSelector = selector;
                break;
            }
        }

        if (!dropdown) {
            console.log(this.logs.provinceNotFound);
            return;
        }

        await settle(this.page, this.waits.provinceOptionsLoad);
        const tagName = await dropdown.evaluate(el => el.tagName.toLowerCase()).catch(() => 'unknown');

        if (tagName === 'select') {
            await this.page.waitForFunction(sel => {
                const el = document.querySelector(sel);
                return el && el.options && el.options.length > 1;
            }, foundSelector, { timeout: this.timeouts.large }).catch(() => { });

            await dropdown.click();
            await settle(this.page, this.waits.provinceDropdownClick);

            const options = await dropdown.evaluate(el =>
                Array.from(el.options)
                    .filter(o => o.value && !o.disabled)
                    .map(o => ({ value: o.value, text: o.textContent.trim() }))
            );

            if (options.length > 0) {
                await dropdown.selectOption(options[0].value);
                await settle(this.page, this.waits.provinceSelection);
                console.log(`${this.logs.provinceSelected} ${options[0].text}`);
            }
        } else if (tagName === 'input') {
            await dropdown.fill(this.config.defaultProvinceInput);
            await settle(this.page, this.waits.provinceInputFill);
            console.log(this.logs.provinceInputFilled);
        }
    }
}

module.exports = CheckoutPage;