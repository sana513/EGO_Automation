Feature: Logout Feature
  As a logged-in user
  I want to logout from my account
  So that I can securely end my session

  Background:
    Given I navigate to the homepage

  @logout @e2e
  Scenario: User can logout from account menu
    Given I am logged in
    When I click on the account icon
    And I click on logout
    Then I should be logged out
    And I should see the sign in option

  @logout @e2e
  Scenario: User is redirected to homepage after logout
    Given I am logged in
    When I logout from my account
    Then I should be logged out
    And I should be redirected to the homepage
    And I should not be on the account page

  @logout @e2e
  Scenario: User can login again after logout
    Given I am logged in
    When I logout from my account
    Then I should be logged out
    When I click on the account icon
    And I enter email for login
    And I enter password for login
    And I click on the login button
    Then I should be logged in

  @logout @ui
  Scenario: Verify logout functionality from account page
    Given I am logged in
    And I navigate to my account page
    When I click on the account icon
    And I click on logout
    Then I should be logged out
    And I should be redirected to the homepage
