Feature: Checkout Flow

  Scenario: Successful checkout with valid details
    Given the user has added a product to the cart
    And navigates to the checkout page
    When the user enters a valid email
    And continues to shipping
    And fills in shipping details
    And selects payment method "card"
    And enters valid card details
    And clicks on Pay Now
    Then the order should be placed successfully
