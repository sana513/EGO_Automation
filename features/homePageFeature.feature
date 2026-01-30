
Feature: Homepage Feature
Background:
    Given I open the website
@homepage 
  Scenario: Verify homepage sections and add product from What's Hot
    Given I open the homepage
    Then I should see the hero banner

    When I scroll down and verify product category grid
    Then I should see all configured categories

    Then I should see Popular Categories section
    And I should see What's Hot section

    When I click any random Add CTA from What's Hot section
    And I select any available size from the quick-add modal
    Then I add the product to the bag from the homepage section