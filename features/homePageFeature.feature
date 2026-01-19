
Feature: Homepage Feature
Background:
    Given I open the website for "us"
@homepage 
  Scenario: Verify homepage sections and add product from What's Hot

    # Entry point: Open homepage
    Given I open the homepage for "us"
    Then I should see the hero banner

    # Validate product category grid
    When I scroll down and verify product category grid
    Then I should see all configured categories

    # Validate additional homepage sections
    Then I should see Popular Categories section
    And I should see What's Hot section

    # User action: Add a product from What's Hot
    When I click any random Add CTA from What's Hot section
    And I select any available size from the quick-add modal
    Then I add the product to the bag from the homepage section