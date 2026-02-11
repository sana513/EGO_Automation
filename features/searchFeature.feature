Feature: Search Feature
  Background:
    Given I open the website

  @search @ui
  Scenario: Complete search functionality test
    Then the search bar should be visible and aligned in the header
    When I click on the search input
    Then the trending categories menu should be visible
    When I type a valid keyword in the search box
    Then the search suggestion box should appear
    When I type a valid keyword in the search box
    And I close the search overlay
    And I click on the search icon again
    Then the search bar should be visible
    And the search input should still contain the valid keyword
    When I search for a valid product
    Then I should see search results
    When I search for an invalid product
    Then I should see a no results message
