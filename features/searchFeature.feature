Feature: Search Feature
  Background:
    Given I navigate to the homepage

  @search @ui
  Scenario: Verify search bar visibility and alignment
    Then the search bar should be visible and aligned in the header

  @search @suggestions @trending
  Scenario: Verify trending categories menu appears on empty search click
    When I click on the search input
    Then the trending categories menu should be visible

  @search @suggestions
  Scenario: Verify search suggestions appear when typing
    When I type "dress" in the search box
    Then the search suggestion box should appear

  @search @bugfix
  Scenario: Verify search input persistence after closing and reopening
    When I type "dress" in the search box
    And I close the search overlay
    And I click on the search icon again
    Then the search bar should be visible
    And the search input should still contain "dress"

  @search @positive
  Scenario: Search for a product
    When I search for "dress"
    Then I should see search results

  @search @negative
  Scenario: Search for non-existent item
    When I search for "nonexistentproductxyz"
    Then I should see a no results message
