const SearchLocators = {
    searchTrigger: 'button[aria-label="Search for a specific phrase on the page"]',
    searchInput: 'input[name="q"]:visible',
    suggestionItems: 'a[role="button"][aria-label]',
    noResultsMessage: '.message, p:has-text("Products Matching"), .no-results, span:has-text("styles")',
    resultsCount: '.product-count-wrapper span',
    productResultItems: '[data-testid="product-card-vertical"]',
    outOfStockBadge: '.out-of-stock-badge',
    closeSuggestions: '.close-icon-typehead, button[aria-label="Close menu"]',
    suggestionContainer: '.typehead-search-container, [id*="search-results"], div[class*="max-w-screen"]',
    trendingHeader: '.typehead-trending-title, :text("Trending Categories"), div:has-text("Trending")',
    trendingItems: '.typehead-trending-item, .trending-item, li.pill-item'
};

module.exports = { SearchLocators };
