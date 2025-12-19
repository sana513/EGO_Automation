const AddToCartLocators = {
   SELECT_SIZE_BUTTON: 'span.uppercase:has-text("Select Size").nth(0)',
  SIZE_OPTION: (size) => `button:has-text("${size}")`,
  ADD_TO_BAG_BUTTON: '[data-testid="add-to-bag"].nth(0)',
  ADD_TO_CART_CONFIRMATION: '[data-testid="add-to-cart-confirmation"]',
  POPUP_CLOSE_BTN: 'button[data-testid="modal-close"]',
};
module.exports =  AddToCartLocators ;