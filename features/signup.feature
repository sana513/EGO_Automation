Feature: User Registration

  Background:
    Given I navigate to the registration page

  @registration @happy-path
  Scenario: Complete manual address registration
    And I enter my initial email "naveed.chughtai@rltsquare.com"
    When I enter personal details:
      | Field           | Value                       |
      | First Name      | Naveed                      |
      | Last Name       | Chughtai                    |
      | Password        | Rlt@20250101                |
      | Confirm Password| Rlt@20250101                |
    And I set date of birth
    And I select "United Kingdom" as country
    And I enter phone number "7400123456"
    And I choose to enter address manually
    And I enter address details:
      | Field     | Value           |
      | Street    | Longford Trading Estate |
      | City      | Manchester             |
      | Post Code | M32 0JT      |
    And I opt out of all marketing communications
    And I submit the registration form
    Then I should be successfully registered
    And I should be redirected to my account

  