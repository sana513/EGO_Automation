Feature: Full E-commerce End-to-End Flow

  Background:
    Given I open the website for "us"

  # ===== LOGIN =====
  @login
  Scenario: Login to my account on US site
    When I perform login with valid credentials
    Then I should be redirected to my account dashboard

  # ===== REGISTRATION =====
  @registration
  Scenario: Complete manual address registration
    Given I navigate to the registration page
    When I enter a unique email for registration
    When I enter personal details:
      | Field           | Value                       |
      | First Name      | Naveed                      |
      | Last Name       | Chughtai                    |
      | Password        | Rlt@20250101                |
      | Confirm Password| Rlt@20250101                |
    And I set date of birth
    And I select "United Kingdom" as country
    And I enter phone number "7400123456"
    And I choose to enter address manually
    And I enter address details:
      | Field     | Value                     |
      | Street    | Longford Trading Estate   |
      | City      | Manchester                |
      | Post Code | M32 0JT                   |
    And I opt out of all marketing communications
    And I submit the registration form
    Then I should be successfully registered
    And I should be redirected to my account

  # ===== HOMEPAGE =====
  @homepage
  Scenario: Verify homepage elements
    Given I navigate to the homepage
    And I decline the modal if it appears
    Then I should see the site logo
    And I should see the search bar
    And I should see all main navigation categories
    And I should see the "33% OFF FOR YOU" promotional banner

  # ===== PLP =====
  @plp
  Scenario: Verify products on PLP
    Given the user is on the product listing page
    Then product tiles should be visible
    When the user scrolls down and clicks load more until all products are loaded

  @plp
  Scenario: Open first product from PLP
    Given the user is on the product listing page
    When the user clicks on the first product

  # ===== PDP / ADD TO CART =====
  @pdp @addtocart
  Scenario: Add product to cart from PDP
    Given the user is on the product detail page
    When the user clicks on the "Select a Size" button
    And the user selects a size from the available options "US 0-2 (S)"
    And the user adds the product to the shopping cart
    Then the mini cart should be visible

  # ===== CHECKOUT =====
  @checkout
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
