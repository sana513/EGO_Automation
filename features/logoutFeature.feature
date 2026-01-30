Feature: Logout Feature
  As a logged-in user
  I want to logout from my account
  So that I can securely end my session

  Background:
    Given I navigate to the homepage

  @logout 
  Scenario: User can logout from account menu
    Given I am logged in
    Given Customer dashboard is displayed
    And I click on logout
    Then I should be logged out
    And User is redirected to homepage

