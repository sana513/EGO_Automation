Feature: Full E-commerce End-to-End Flow

  Background:
    Given I open the website for "us"

  @registration @e2e
  Scenario: Complete manual address registration
    Given I navigate to the registration page
    When I enter a unique email for registration
    When I enter personal details
    And I set date of birth
    And I select country and enter phone number for registration
    And I choose to enter address manually
    And I enter registration address details
    And I opt out of all marketing communications
    And I submit the registration form
    Then I should be successfully registered
    And I should be redirected to my account

  @login @e2e
  Scenario: Login to my account
    When I perform login with valid credentials
    Then I should be redirected to my account dashboard

  @homepage @e2e
  Scenario: Verify homepage sections and add product from What's Hot
    Given I open the homepage for "us"
    Then I should see the hero banner
    When I scroll down and verify product category grid
    Then I should see all configured categories
    Then I should see Popular Categories section
    And I should see What's Hot section
    When I click any random Add CTA from What's Hot section
    And I select any available size from the quick-add modal
    Then I add the product to the bag from the homepage section

  @search @e2e
  Scenario: Verify search bar visibility and alignment
    Given I navigate to the homepage
    Then the search bar should be visible and aligned in the header

  @search @e2e
  Scenario: Verify trending categories menu on empty search click
    Given I navigate to the homepage
    When I click on the search input
    Then the trending categories menu should be visible

  @search @e2e
  Scenario: Verify search suggestions when typing
    Given I navigate to the homepage
    When I type a valid keyword in the search box
    Then the search suggestion box should appear

  @search @e2e
  Scenario: Search for a product
    Given I navigate to the homepage
    When I search for a valid product
    Then I should see search results

  @search @e2e
  Scenario: Search for non-existent item
    Given I navigate to the homepage
    When I search for an invalid product
    Then I should see a no results message

  @search @e2e
  Scenario: Verify search input persistence after closing and reopening
    Given I navigate to the homepage
    When I type a valid keyword in the search box
    And I close the search overlay
    And I click on the search icon again
    Then the search bar should be visible
    And the search input should still contain the valid keyword

  @plp @e2e
  Scenario: Verify products on PLP
    Given I open the PLP page
    Then all product tiles should be visible
    When I scroll down and click load more until all products are loaded

  @plp @e2e
  Scenario: Open first product from PLP
    Given I open the PLP page
    When I open the first product
    Then I should be on the PDP page

  @plp @e2e
  Scenario: Open configured product by index from PLP
    Given I open the configured product from PLP
    Then I should be on the PDP page

  @addtocart @e2e
  Scenario: Update cart and proceed to checkout
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    When I update the quantity randomly
    And I update the product size randomly
    And I add the product to wishlist
    And I apply the coupon code
    And I proceed to checkout

  @checkout @e2e
  Scenario: Complete checkout flow from product selection to order placement
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    And I proceed to checkout
    When I enter email for checkout
    And I continue to shipping
    And I fill in shipping details
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully
