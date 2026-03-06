const ProductDetailPage = require('./ProductDetailPage/pdpPage');
const basePage = require('./basePage');
const CheckoutAuthPage = require('./checkout/checkoutAuthPage');
const { AddToCartLocators } = require('../locators/addToCartLocators');
const { testData } = require('../config/testData');
const { TIMEOUTS } = require('../config/constants');
const { generateGuestEmail, getRandomIndex } = require('../features/support/utils');
const { addToCartLogs } = require('../config/egoLogs');
const { addToCartLabels } = require('../config/egoLabels');

class AddToCartPage extends basePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.pdp = new ProductDetailPage(page);

    this.updateQuantity = AddToCartLocators.Update_quantity;
    this.updateSize = AddToCartLocators.Update_size;
    this.addToWishlist = AddToCartLocators.Add_to_Wishlist;

    this.couponInput = AddToCartLocators.Coupon_Input;
    this.submitButton = AddToCartLocators.Submit_button;

    this.checkoutButton = AddToCartLocators.Checkout_button;
  }
  async openRandomProduct() {
    await this.pdp.openRandomProductFromPLP();
  }

  async openRandomProductFromSearch(keyword) {
    await this.pdp.openRandomProductFromSearch(keyword);
  }

  async selectSizeAndAddToBag() {
    await this.pdp.selectAnyAvailableSize();
    await this.pdp.addToBag();
  }

  async openCart() {
    await this.pdp.openCart();
  }

  async updateQuantityRandomly() {
    const qtySelect = this.page.locator(this.updateQuantity);
    await qtySelect.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });

    const options = await qtySelect.locator('option').allTextContents();
    const validOptions = options.filter(o => !isNaN(parseInt(o)));

    const randomQty = validOptions[getRandomIndex(validOptions.length)];

    await qtySelect.selectOption(randomQty);
  }

  async updateSizeRandomly() {
    console.log(addToCartLogs.startingSizeUpdate);

    const sizeSelects = this.page.locator(this.updateSize);
    const count = await sizeSelects.count();

    let targetSelect = null;
    for (let i = 0; i < count; i++) {
      const select = sizeSelects.nth(i);
      if (await select.isVisible() && await select.isEnabled()) {
        targetSelect = select;
        break;
      }
    }

    if (!targetSelect) throw new Error('No visible/enabled cart size dropdown found!');

    const options = await targetSelect.locator('option').all();

    const availableOptions = [];
    for (const option of options) {
      const disabled = await option.getAttribute('disabled');
      const text = (await option.textContent())?.trim() || '';
      if (!disabled && !text.toLowerCase().includes(addToCartLabels.outOfStock) && text !== '') {
        const value = await option.getAttribute('value');
        availableOptions.push({ text, value });
      }
    }

    if (availableOptions.length === 0) {
      console.warn(addToCartLogs.noAvailableSizes);
      return;
    }

    const randomIndex = getRandomIndex(availableOptions.length);
    const randomSize = availableOptions[randomIndex];

    console.log(`${addToCartLogs.selectingCartSize} ${randomSize.text}`);
    await targetSelect.selectOption({ value: randomSize.value });
    console.log(`${addToCartLogs.selectedCartSize} ${randomSize.text}`);
  }


  async addProductToWishlist() {
    const wishlistBtn = this.page.locator(this.addToWishlist).first();
    await wishlistBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await wishlistBtn.click();
    const loginDrawer = this.page.locator('[data-testid="drawer"]');

    if (await loginDrawer.isVisible({ timeout: 3000 }).catch(() => false)) {
      const closeBtn = '#Capa_1';
      await this.click(closeBtn);
      await loginDrawer.waitFor({ state: 'hidden', timeout: TIMEOUTS.medium });
    }
  }

  async applyCoupon(code) {
    const couponInput = this.page.locator(this.couponInput);
    await couponInput.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await couponInput.scrollIntoViewIfNeeded();
    await couponInput.fill(code);

    const submitBtn = this.page.locator(this.submitButton);
    await submitBtn.waitFor({ state: 'visible', timeout: TIMEOUTS.medium });
    await submitBtn.click();

    console.log(addToCartLogs.couponApplied);
  }

  async proceedToCheckout() {
    await this.click(this.checkoutButton);

    await this.handleCheckoutAuthenticationPage();
  }

  async handleCheckoutAuthenticationPage() {
    const { settle } = require('../utils/dynamicWait');
    const env = process.env.ENV || 'stage';
    await settle(this.page, 3000);

    console.log(`[${env.toUpperCase()}] ${addToCartLogs.checkingAuthPage}`);
    console.log(`${addToCartLogs.currentUrl} ${this.page.url()}`);
    const authPage = new CheckoutAuthPage(this.page);
    const isAuthPage = await authPage.isOnAuthPage();

    if (isAuthPage) {
      console.log(`[${env.toUpperCase()}] ${addToCartLogs.authPageDetected}`);
      const guestEmail = generateGuestEmail();

      await authPage.checkoutAsGuest(guestEmail);
    } else {
      console.log(`[${env.toUpperCase()}] ${addToCartLogs.noAuthPageDetected}`);
    }
  }
}

module.exports = AddToCartPage;
