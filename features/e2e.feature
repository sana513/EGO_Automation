Feature: Unified E-commerce End-to-End Flow

  @full_journey @e2e_unified
  Scenario: Complete End-to-End User Journey (Single Session)
    # Phase 1: User Account Lifecycle (Registration)
    Given I open the website
    And I navigate to the registration page
    When I enter a unique email for registration
    And I enter personal details
    And I set date of birth
    And I select country and enter phone number for registration
    And I choose to enter address manually
    And I enter registration address details
    And I opt out of all marketing communications
    And I submit the registration form
    Then I should be successfully registered
    And I should be redirected to my account

    # Phase 1.5: Logout & Login Validation
    When I perform logout in unified flow
    Then I should be logged out
    Given I perform login in unified flow
    Then I should be redirected to my account dashboard

    # Phase 2: Homepage Validation
    Given I open the homepage for "us"
    Then I should see the hero banner
    When I scroll down and verify product category grid
    Then I should see all configured categories
    Then I should see Popular Categories section
    And I should see What's Hot section
    
    # Phase 3: PLP Validation (From Homepage)
    Given I navigate to the homepage
    When I search for a valid product
    Then I should see search results
    Given I open the PLP page
    Then all product tiles should be visible
    When I scroll down and click load more until all products are loaded

    # Phase 4 & 5: PDP, Cart & Checkout (primary flow)
    When I open a random product from PLP
    Then I should be on the PDP page
    When I select any available size
    And I add the product to the bag
    Then I open the cart page
    When I update the quantity randomly
    And I update the product size randomly
    And I proceed to checkout
    When I enter email for checkout
    And I continue to shipping
    And I fill in shipping details
    And I enter valid card details
    And I click on Pay Now
    Then the order should be placed successfully

    # Phase 6: Second Product Flow (Regression Safety - without logout)
    Given I open the PLP page
    When I open the configured product from PLP
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
