const PLPLocators = {
    pageTitle: 'h1',
    pageDescription: '.catalog-page-content p, h1 + div',
    productTile: '[data-testid="product-card-vertical"]',
    productTitle: 'a[data-testid="link"] span',
    productPrice: '[data-testid="special-price"], [data-testid="regular-price"]',
    productImage: 'img[data-testid="image-slot"]',
    wishlistIcon: 'button[aria-label="Add to Wishlist"]',
    loadMoreButton: '[data-testid="pagination-next"]',
    mainCategoryLinks: 'a.trigger-nav-level-1',
    subCategoryLinks: 'a.capitalize',
};

module.exports = { PLPLocators };
