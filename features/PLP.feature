Feature: Product Listing Page

  Scenario: Verify products on PLP
    Given the user is on the product listing page
    Then product tiles should be visible
    When the user scrolls down and clicks load more until all products are loaded

  Scenario: Open first product from PLP
    Given the user is on the product listing page
    When the user clicks on the first product
