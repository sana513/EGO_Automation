Feature: PDP Feature
Background:
    Given I open the website
@pdp 
Scenario: Add a random product to the cart from PLP
  And I open a random product from PLP
  When I select any available size
  And I add the product to the bag
  Then I open the cart page

@pdp @search-pdp
Scenario: Add a random product to the cart from Search
  And I open a random product from search
  When I select any available size
  And I add the product to the bag
  Then I open the cart page