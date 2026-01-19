const AddToCartLocators = {
    Update_quantity: '[data-testid="cart-product-card-quantity-select"]',
    Update_size: '[data-testid="cart-product-card-size-select"]',
    Delete_Product: '[data-testid="cart-product-card-remove-button !align-top"]',
    Add_to_Wishlist: 'button[aria-label="Add to Wishlist"]',
    Coupon_Input: 'input#discont-field[data-testid="input-field"]',
    Submit_button: '[data-testid="button"][aria-label="Submit"]',
    Checkout_button: '[data-testid="go-to-checkout"][aria-label="Go to Checkout"]'
};

module.exports = { AddToCartLocators };
