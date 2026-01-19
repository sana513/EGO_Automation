Feature: Registration Feature
Background:
    Given I open the website for "us"   
@registration 
  Scenario: Complete manual address registration
    Given I navigate to the registration page
    When I enter a unique email for registration
    When I enter personal details
    And I set date of birth
    And I select country and enter phone number
    And I choose to enter address manually
    And I enter address details
    And I opt out of all marketing communications
    And I submit the registration form
    Then I should be successfully registered
    And I should be redirected to my account