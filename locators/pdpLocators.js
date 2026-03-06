const pdpLocators = {
    sizeSelectorButton: 'span:has-text("Select a Size"), span:has-text("Select Size")',
    addToBagButton: '[data-testid="add-to-bag"]',
    addAllToBagButton: 'button:has-text("ADD ALL TO BAG")',
    cartIcon: '[id="Bag icon_2"]',
    sizeOptions: 'ul.select-options li',
    sizeSpan: 'span',
    miniCartDrawer: '[data-testid="drawer"]',
    miniCartCloseButton: '[data-testid="drawer"] #Capa_1, [data-testid="drawer"] [aria-label="Close"]',
    oosHeading: 'h2:has-text("Item Out Of Stock")',
    recommendedProducts: '[data-testid="product-card-vertical"]',
    multiSize: {
        container: 'div.flex.flex-col.md\\:max-w-\\[351px\\]',
        sizeSelect: '[data-testid="select-input"]',
        sizeOption: 'option',
        addToBagButton: 'button:has-text("SELECT SIZE")',
        addAllToBagButton: 'button:has-text("ADD ALL TO BAG")',
    },
    outOfStockTitle: 'h2:has-text("Item Out Of Stock"), h1:has-text("Out Of Stock")',
    nativeSelectLocator: '[data-testid="select-input"]',
    blockingOverlay: 'div.absolute.inset-0[class*="bg-white"][class*="bg-opacity"]',
    dropdownList: 'ul.select-options',
};

module.exports = { pdpLocators };
