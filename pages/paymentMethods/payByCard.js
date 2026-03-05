const { settle } = require('../../utils/dynamicWait');
const { CHECKOUT_WAIT_TIMES } = require('../../config/constants');
const { checkoutLogs } = require('../../config/egoLogs');
const { checkoutLabels } = require('../../config/egoLabels');
const { PayByCardLocators } = require('../../locators/payByCardLocators');

class PayByCard {
    constructor(page, locators, config, timeouts) {
        this.page = page;
        this.locators = { ...locators, payByCard: PayByCardLocators };
        this.config = config;
        this.waits = CHECKOUT_WAIT_TIMES;
        this.timeouts = timeouts;
        this.logs = checkoutLogs;
        this.labels = checkoutLabels;
    }

    async fillCardDetails(card) {
        console.log(this.logs.startCardEntry);

        await this.page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => { });
        await settle(this.page, this.waits.paymentFormLoad);
        const maxRetries = 3;
        for (let attempt = 1; attempt <= maxRetries; attempt++) {
            console.log(`Detecting payment method (attempt ${attempt}/${maxRetries})...`);

            const checkoutComCardNumber = await this.page.locator(this.locators.payByCard.checkoutComIframesContainer).count();
            if (checkoutComCardNumber > 0) {
                console.log(this.logs.usingCheckoutCom);
                await this.fillCheckoutComFields(card);
                return;
            }

            const bigCommerceFrames = await this.page.locator(this.locators.payByCard.bigCommerceIframes).count();
            if (bigCommerceFrames > 0) {
                console.log(this.logs.usingBigCommerce);
                await this.fillBigCommerceHostedFields(card);
                return;
            }

            const stripeFrames = await this.page.locator(this.locators.payByCard.stripeIframe).count();
            if (stripeFrames > 0) {
                console.log(this.logs.usingStripe);
                await this.fillStripeFields(card);
                return;
            }

            const directInputs = await this.page.locator(this.locators.payByCard.directCardInputs.number).count();
            if (directInputs > 0) {
                console.log(this.logs.usingDirectCard);
                await this.fillDirectCardInputs(card);
                return;
            }

            if (attempt < maxRetries) {
                console.log('No payment fields found yet, waiting...');
                await settle(this.page, 3000);
            }
        }

        throw new Error(this.logs.noPaymentFields);
    }

    async fillCheckoutComFields(card) {
        const iframes = this.locators.payByCard.checkoutComIframes;

        const cardNumberFrame = this.page.locator(iframes.cardNumber).contentFrame();
        await cardNumberFrame.getByRole('textbox', { name: this.labels.inputLabels.cardNumber }).waitFor({ timeout: this.timeouts.large });
        await cardNumberFrame.getByRole('textbox', { name: this.labels.inputLabels.cardNumber }).fill(card.number);
        console.log(this.logs.cardNumberFilled);

        const cardNameFrame = this.page.locator(iframes.cardName).contentFrame();
        await cardNameFrame.getByRole('textbox', { name: this.labels.inputLabels.nameOnCard }).fill(card.name);
        console.log(this.logs.cardNameFilled);

        const expiryFrame = this.page.locator(iframes.expiry).contentFrame();
        await expiryFrame.getByRole('textbox', { name: this.labels.inputLabels.expiration }).fill(card.expiry);
        console.log(this.logs.expiryFilled);

        const cvvFrame = this.page.locator(iframes.cvv).contentFrame();
        await cvvFrame.getByRole('textbox', { name: this.labels.inputLabels.cvvStrict }).fill(card.cvc);
        console.log(this.logs.cvvFilled);
    }

    async fillBigCommerceHostedFields(card) {
        const allFrames = this.page.locator(this.locators.payByCard.bigCommerceIframes);
        const frameCount = await allFrames.count();

        for (let i = 0; i < frameCount; i++) {
            const frame = this.page.frameLocator(this.locators.payByCard.bigCommerceIframes).nth(i);
            const input = frame.locator(this.locators.payByCard.bigCommerceInput).first();

            const isVisible = await input.isVisible({ timeout: this.timeouts.small }).catch(() => false);
            if (!isVisible) continue;

            const placeholder = await input.getAttribute('placeholder').catch(() => '');
            const name = await input.getAttribute('name').catch(() => '');
            const id = await input.getAttribute('id').catch(() => '');
            const ariaLabel = await input.getAttribute('aria-label').catch(() => '');
            const autocomplete = await input.getAttribute('autocomplete').catch(() => '');

            const fieldIdentifier = (placeholder + ' ' + name + ' ' + id + ' ' + ariaLabel + ' ' + autocomplete).toLowerCase();
            const patterns = this.labels.bigCommerceFieldPatterns;

            if (patterns.number.some(p => fieldIdentifier.includes(p.toLowerCase())) && !fieldIdentifier.includes('cvv')) {
                await input.fill(card.number);
            } else if (patterns.expiry.some(p => fieldIdentifier.includes(p.toLowerCase()))) {
                await input.fill(card.expiry);
            } else if (patterns.cvv.some(p => fieldIdentifier.includes(p.toLowerCase()))) {
                await input.fill(card.cvc);
            } else if (patterns.name.some(p => fieldIdentifier.includes(p.toLowerCase()))) {
                await input.fill(card.name);
            }
        }
        console.log(this.logs.bigCommerceFilled);
    }

    async fillStripeFields(card) {
        const frame = this.page.frameLocator(this.locators.payByCard.stripeIframe);
        const names = this.config.stripeInputNames;
        await frame.locator(`input[name="${names.cardNumber}"]`).fill(card.number);
        await frame.locator(`input[name="${names.expDate}"]`).fill(card.expiry);
        await frame.locator(`input[name="${names.cvc}"]`).fill(card.cvc);
        console.log(this.logs.stripeFilled);
    }

    async fillDirectCardInputs(card) {
        const locators = this.locators.payByCard.directCardInputs;
        await this.page.locator(locators.number).fill(card.number);
        await this.page.locator(locators.expiry).fill(card.expiry);
        await this.page.locator(locators.cvc).fill(card.cvc);
        console.log(this.logs.directCardFilled);
    }

}

module.exports = PayByCard;