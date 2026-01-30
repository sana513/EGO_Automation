Feature: Checkout Feature

Background:
    Given I open the website

@checkout
Scenario: Complete checkout flow for guest user
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
    And Select the shipping method
    And Click on continue to payment
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully

@checkout
Scenario: Complete checkout flow for registered user
    # Add product to cart
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    And I proceed to checkout
    
    # Complete checkout process
    When I enter email for checkout
    And I click on sign in
    And I enter password for checkout
    And I click on sign in
    And I continue to shipping
    And select the saved address
    And Select the shipping method
    And Click on continue to payment
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully