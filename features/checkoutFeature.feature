Feature: Checkout Feature

Background:
    Given I open the website

@checkout @guest
Scenario: Complete checkout flow for guest user
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    And I proceed to checkout
    
    When I enter email for checkout
    And I continue to shipping
    And I fill in shipping details
    And Select the shipping method
    And Click on continue to payment
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully

@checkout @customer
Scenario: Complete checkout flow for registered user
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    And I proceed to checkout
    When I enter email for checkout
    And I click on sign in
    And I enter password for checkout
    And select the saved address
    And Select the shipping method
    And Click on continue to payment
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully