const ProductDetailPage = require('./pdpPage');
const BasePage = require('./basePage');
const { AddToCartLocators } = require('../locators/addToCartLocators');
const { testData } = require('../config/testData');

class AddToCartPage extends BasePage {
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

  async selectSizeAndAddToBag() {
    await this.pdp.selectAnyAvailableSize();
    await this.pdp.addToBag();
  }

  async openCart() {
    await this.pdp.openCart();
  }

  async updateQuantityRandomly() {
    const qtySelect = this.page.locator(this.updateQuantity);
    await qtySelect.waitFor({ state: 'visible', timeout: testData.timeouts.medium });

    const options = await qtySelect.locator('option').allTextContents();
    const validOptions = options.filter(o => !isNaN(parseInt(o)));

    const randomQty =
      validOptions[Math.floor(Math.random() * validOptions.length)];

    await qtySelect.selectOption(randomQty);
  }

  async updateSizeRandomly() {
    console.log("🔹 Starting cart size update...");

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
      if (!disabled && !text.toLowerCase().includes(testData.cart.labels.outOfStock) && text !== '') {
        const value = await option.getAttribute('value');
        availableOptions.push({ text, value });
      }
    }

    if (availableOptions.length === 0) {
      console.warn('No additional available sizes found in cart. Skipping size update.');
      return;
    }

    const randomIndex = Math.floor(Math.random() * availableOptions.length);
    const randomSize = availableOptions[randomIndex];

    console.log(`Selecting cart size: ${randomSize.text}`);
    await targetSelect.selectOption({ value: randomSize.value });
    console.log(`Successfully selected cart size: ${randomSize.text}`);
  }


  async addProductToWishlist() {
    const wishlistBtn = this.page.locator(this.addToWishlist).first();
    await wishlistBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await wishlistBtn.click();
    const loginDrawer = this.page.locator('[data-testid="drawer"]');

    if (await loginDrawer.isVisible({ timeout: 3000 }).catch(() => false)) {
      const closeBtn = this.page.locator('#Capa_1');
      await closeBtn.click();
      await loginDrawer.waitFor({ state: 'hidden', timeout: testData.timeouts.medium });
    }
  }

  async applyCoupon(code) {
    const couponInput = this.page.locator(this.couponInput);
    await couponInput.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await couponInput.scrollIntoViewIfNeeded();
    await couponInput.fill(code);

    const submitBtn = this.page.locator(this.submitButton);
    await submitBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await submitBtn.click();

    console.log("Coupon applied successfully");
  }

  async proceedToCheckout() {
    const checkoutBtn = this.page.locator(this.checkoutButton);
    await checkoutBtn.waitFor({ state: 'visible', timeout: testData.timeouts.medium });
    await checkoutBtn.click();
  }
}

module.exports = AddToCartPage;
