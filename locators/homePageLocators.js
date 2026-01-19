const HomePageLocators = {
    LOGO: '[data-testid="logo"]',
    HERO_BANNER: '//*[@id="splide01-slide01"]/div',
    PRODUCT_GRID_MAIN: 'div[title="Shop By Trend"][heading="Shop By Trend"]',
    CATEGORY_CARDS: {
        CO_ORDS: '.item a[href*="co-ords"]',
        TOPS: '.item a[href*="/c/clothing/tops"]',
        DRESSES: '.item a[href*="/c/clothing/dresses"]',
        LOUNGEWEAR: '.item a[href*="loungwear-co-ords"]'
    },
    POPULAR_CATEGORY_HEADING: 'h2:has-text("Popular Categories")',
    WHATS_HOT_HEADING: 'h2:has-text("What\'s Hot!")',
    WHATS_HOT_SECTION: 'section:has(h2:has-text("What\'s Hot!"))',
    WHATS_HOT_ADD_BUTTONS:
        'button[data-testid="quick-add-button"]',
    SIZE_CONTAINER: 'div.flex.flex-col.h-full.overflow-y-auto',
    SIZE_OPTIONS:
        'div.flex.flex-col.h-full.overflow-y-auto ul li > button',
    ADD_TO_BAG_BUTTON: 'button:has-text("Add to Bag")',
    SIZE_BY_TEXT: (size) =>
        `div.flex.flex-col.h-full.overflow-y-auto ul li > button:has(span:text("${size}"))`,
};

module.exports = { HomePageLocators };
