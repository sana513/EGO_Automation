Feature: PLP Feature
Background:
    Given I open the website for "us"
 @plp 
Scenario: Verify products on PLP
  Given I open the PLP page
  Then all product tiles should be visible
  When I scroll down and click load more until all products are loaded

@plp 
Scenario: Open first product from PLP
  Given I open the PLP page
  When I open the first product
  Then I should be on the PDP page

@plp @sequential
Scenario: Verify multiple categories sequentially
  Given I navigate through all subcategories sequentially and verify PLP visibility

@plp
Scenario: Open specific product by index
  Given I open the PLP page
  When I open product number 3
  Then I should be on the PDP page

@plp 
Scenario: Verify multiple categories sequentially
  Given I navigate through all subcategories sequentially and verify PLP visibility