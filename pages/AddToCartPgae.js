const ProductDetailPage = require('../pages/PDP_Page');
const BasePage = require('../pages/BasePage');
const { AddToCartLocators } = require('../locators/EGO_Locators');

class AddToCartPage extends BasePage {
  constructor(page) {
    super(page);
    this.page = page;
    this.pdp = new ProductDetailPage(page);

    this.updateQuantity = AddToCartLocators.Update_quantity;
    this.updateSize = AddToCartLocators.Update_size;
    this.addToWishlist = 'button[aria-label="Add to Wishlist"]';

    // Coupon
    this.couponInput =
      'span[data-testid="input"] input[data-testid="input-field"]';
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
    await qtySelect.waitFor({ state: 'visible', timeout: 10000 });

    const options = await qtySelect.locator('option').allTextContents();
    const validOptions = options.filter(o => !isNaN(parseInt(o)));

    const randomQty =
      validOptions[Math.floor(Math.random() * validOptions.length)];

    await qtySelect.selectOption(randomQty);
  }

  async updateSizeRandomly() {
    console.log("🔹 Starting cart size update...");

    // 1️⃣ Get the size <select>
    const sizeSelect = this.page.locator(this.updateSize);
    await sizeSelect.waitFor({ state: 'visible', timeout: 10000 });
    console.log("✅ Cart size dropdown is visible");

    // 2️⃣ Get all enabled options and filter out placeholder options
    const options = await sizeSelect.locator('option:enabled').allTextContents();
    const availableSizes = options.filter(
        (s) => s && !s.toLowerCase().includes('select') && !s.toLowerCase().includes('out of stock')
    );

    if (availableSizes.length === 0) {
        throw new Error('No enabled sizes available in the cart dropdown!');
    }

    // 3️⃣ Pick a random available size
    const randomIndex = Math.floor(Math.random() * availableSizes.length);
    const randomSize = availableSizes[randomIndex];
    console.log(`🎯 Selecting random cart size: ${randomSize}`);

    // 4️⃣ Select the size
    await sizeSelect.selectOption({ label: randomSize });
    console.log(`✅ Successfully selected cart size: ${randomSize}`);
}

  async addProductToWishlist() {
    const wishlistBtn = this.page.locator(this.addToWishlist).first();
    await wishlistBtn.waitFor({ state: 'visible', timeout: 5000 });
    await wishlistBtn.click();

    // Login drawer appears → close it
    const loginDrawer = this.page.locator('[data-testid="drawer"]');

    if (await loginDrawer.isVisible({ timeout: 3000 }).catch(() => false)) {
      const closeBtn = this.page.locator('#Capa_1');
      await closeBtn.click();
      await loginDrawer.waitFor({ state: 'hidden', timeout: 10000 });
    }
  }

  async applyCoupon(code) {
    // Close any overlay if present
    const closeBtn = this.page.locator('#Capa_1');
    if (await closeBtn.isVisible().catch(() => false)) {
      await closeBtn.click();
    }

    const couponInput = this.page.locator(this.couponInput);
    await couponInput.waitFor({ state: 'visible', timeout: 15000 });
    await couponInput.scrollIntoViewIfNeeded();
    await couponInput.fill(code);

    const submitBtn = this.page.locator(this.submitButton);
    await submitBtn.waitFor({ state: 'visible', timeout: 5000 });
    await submitBtn.click();
  }

  async proceedToCheckout() {
    const checkoutBtn = this.page.locator(this.checkoutButton);
    await checkoutBtn.waitFor({ state: 'visible', timeout: 15000 });
    await checkoutBtn.click();
  }
}

module.exports = AddToCartPage;
