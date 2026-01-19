Feature: Checkout Feature

Background:
    Given I open the website for "us"

@checkout
Scenario: Complete checkout flow from product selection to order placement
    # Add product to cart
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    And I proceed to checkout
    
    # Complete checkout process
    When I enter email for checkout
    And I continue to shipping
    And I fill in shipping details
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully