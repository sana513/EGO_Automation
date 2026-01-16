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
  @homepage @e2e
  Scenario: Verify homepage sections and add product from What's Hot

    # Entry point: Open homepage
    Given I open the homepage for "us"
    Then I should see the hero banner

    # Validate product category grid
    When I scroll down and verify product category grid
    Then I should see Co-Ords category
    And I should see Tops category
    And I should see Dresses category
    And I should see Loungewear category

    # Validate additional homepage sections
    Then I should see Popular Categories section
    And I should see What's Hot section

    # User action: Add a product from What's Hot
    When I click any random Add CTA from What's Hot section
    And I select any available size from the quick-add modal
    Then I add the product to the bag from the homepage section

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

@plp @sequential
Scenario: Verify multiple categories sequentially
  Given I navigate through all subcategories sequentially and verify PLP visibility


  # ===== PDP / ADD TO CART =====
  @pdp 
Scenario: Add a random product to the cart
  And I open a random product from PLP
  When I select any available size
  And I add the product to the bag
  Then I open the cart page
 # ===== ADD TO CART =====
@addtocart @e2e
Scenario: Update cart and proceed to checkout
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
  Scenario: Complete checkout flow from product selection to order placement
    # Add product to cart
    Given I open a random product from PLP
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    And I proceed to checkout
    
    # Complete checkout process
    When I enter email "sana.zafar@rltsquare.com" for checkout
    And I continue to shipping
    And I fill in shipping details
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully
