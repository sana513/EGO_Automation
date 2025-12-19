const HomePageLocators = {

  // ========== MODAL/SYSTEM ELEMENTS ==========
  modal: {
    BUTTON2_WRAPPER: '#button2_wrapper',
    BUTTON2: '#button2',
  },

  // ========== HEADER ELEMENTS ==========
  LOGO: '[data-testid="logo"]',
  SEARCH_BAR: 'input[data-testid="input-field"].nth(0)',
  SEARCH_ICON: 'svg[id="Search icon small"]',
  USER_ICON: 'svg[id="Acount icon"]',
  WISHLIST_ICON: 'svg[data-v-047d3161] path[d*="M13.0347"]', // heart icon
  CART_ICON: 'svg[id="Bag icon"]',
  STORE_SWITCHER: 'button[class*="store"], button:has-text("USD")',

  // ========== MAIN NAVIGATION ==========
  NEW_IN: 'span[data-v-497370f6]:has-text("New In")',
  WINTER: 'span[data-v-497370f6]:has-text("Winter")',
  CLOTHING: 'span[data-v-497370f6]:has-text("Clothing")',
  DRESSES: 'span[data-v-497370f6]:has-text("Dresses")',
  CO_ORDS: 'span[data-v-497370f6]:has-text("Co Ords")',
  TOPS: 'span[data-v-497370f6]:has-text("Tops")',
  BOTTOMS: 'span[data-v-497370f6]:has-text("Bottoms")',
  SHOES: 'span[data-v-497370f6]:has-text("Shoes")',
  ACCESSORIES: 'span[data-v-497370f6]:has-text("Accessories")',
  SALE: 'span[data-v-497370f6].menu-item-red:has-text("Sale")',

  // ========== ESSENTIAL SUBCATEGORIES ==========
  ALL_NEW_IN: 'a[href*="/c/new-in"]:has-text("All New In")',
  NEW_IN_CLOTHING: 'a[href*="/c/new-in-clothing"]:has-text("New in Clothing")',
  NEW_IN_DRESSES: 'a[href*="/c/new-in-dresses"]:has-text("New in Dresses")',

  // Winter category
  ALL_WINTER_EDIT: 'a[href*="/c/winter"]:has-text("All Winter Edit")',
  WINTER_COATS_JACKETS: 'a[href*="/c/winter-coats-jackets"]:has-text("Coats & Jackets")',

  // Clothing category
  ALL_CLOTHING: 'a[href*="/c/clothing"]:has-text("All Clothing")',
  CLOTHING_DRESSES: 'a[href*="/c/clothing-dresses"]:has-text("Dresses")',

  // Dresses category
  ALL_DRESSES: 'a[href*="/c/dresses"]:has-text("All Dresses")',
  DRESSES_PARTY: 'a[href*="/c/dresses-party"]:has-text("Party Dresses")',


  // ========== MAIN BANNER ==========
  MAIN_BANNER_NEW_IN: 'a.main-banner-link:has-text("New In")',
  MAIN_BANNER_CHRISTMAS: 'a.main-banner-link:has-text("Christmas")',
  MAIN_BANNER_SALE: 'a.main-banner-link:has-text("Sale")',
  // ===== Promotional Banner =====
  PROMO_BANNERS: 'a[href*="discount-scheme"], a[href*="/sale"], span:has-text("OFF")',

  // ========== What's The Hot Section ==========
  WHATS_HOT_SECTION: 'section:has-text("What\'s Hot!")',
  WHATS_HOT_PRODUCT_IMAGE: 'section:has-text("What\'s Hot!") img',
  WHATS_HOT_PRODUCT_NAME: 'section:has-text("What\'s Hot!") .product-name', // adjust class
  WHATS_HOT_PRODUCT_PRICE: 'section:has-text("What\'s Hot!") .product-price', // adjust class
  WHATS_HOT_ADD_BTN: 'section:has-text("What\'s Hot!") button.add-to-cart', // adjust class


  // ========== FOOTER ==========
  FOOTER: 'footer, [class*="footer"]',
  CURRENCY_SELECTOR: 'button:has-text("USD")',

  // ========== UTILITY SELECTORS ==========
  HIDDEN_MOBILE: '.min-\\[1025px\\]\\:hidden',
  VISIBLE: ':visible',
  HIDDEN: ':hidden',

  // ========== DYNAMIC SELECTOR GENERATORS ==========
  // Use these to avoid hardcoding all subcategories
  getCategoryLink: (text) => `a[data-v-497370f6]:has-text("${text}")`,
  getProductByIndex: (index) => `[class*="product-card"]:nth(${index})`,
  getProductByName: (name) => `:has-text("${name}")`,

  // ========== PAGE STRUCTURE ==========
  BODY: 'body',
  HEADER: 'header, [class*="header"]',
  MAIN_CONTENT: 'main, [class*="main-content"]',

  // ========== INTERACTIVE ELEMENTS ==========
  BUTTON: 'button, [role="button"]',
  LINK: 'a[href]',

  // ========== RESPONSIVE STATES ==========
  MOBILE_MENU: '.max-\\[1024px\\]\\:block, .max-\\[1024px\\]\\:visible',
  DESKTOP_MENU: '.min-\\[1025px\\]\\:block, .min-\\[1025px\\]\\:visible',

};

module.exports = HomePageLocators;