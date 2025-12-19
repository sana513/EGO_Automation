Feature: Add To Cart Functionality

  Scenario: User adds a product to the cart
    Given the user is on the product detail page
    When the user clicks on the "Select a Size" button
        And the user selects a size from the available options "US 0-2 (S)"
    Then the product should be added to the shopping cart