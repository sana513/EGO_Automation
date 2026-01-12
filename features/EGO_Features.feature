Feature: Full E-commerce End-to-End Flow

  Background:
    Given I open the website for "us"

    # ===== REGISTRATION =====
  @registration @e2e
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

  # ===== LOGIN =====
  @login @e2e
  Scenario: Login to my account on US site
    When I perform login with valid credentials
    Then I should be redirected to my account dashboard

  # ===== HOMEPAGE =====
  

  # ===== PLP =====
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
Scenario: Open specific product by index
  Given I open the PLP page
  When I open product number 3
  Then I should be on the PDP page


  # ===== PDP / ADD TO CART =====
  @pdp 
Scenario: Add a random product to the cart
  Given I open the website for "us"
  And I open a random product from PLP
  When I select any available size
  And I add the product to the bag
  Then I open the cart page
 # ===== ADD TO CART =====
@addtocart @e2e
Scenario: Update cart and proceed to checkout
  Given I open the website for "us"
  And I open a random product from PLP
  When I select any available size
  And I add the product to the bag
  Then I open the cart page
  When I update the quantity randomly
  And I update the product size randomly
  And I add the product to wishlist
  And I apply the coupon code "R5D48EF48"
  And I proceed to checkout

  # ===== CHECKOUT =====
  @checkout @e2e
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
