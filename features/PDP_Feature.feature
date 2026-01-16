Feature: PDP Feature
Background:
    Given I open the website for "us"   
@pdp 
Scenario: Add a random product to the cart
  And I open a random product from PLP
  When I select any available size
  And I add the product to the bag
  Then I open the cart page