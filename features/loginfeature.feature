Feature: Login Feature
Background:
  Given I open the website
 @login
  Scenario: Login to my account
  When I perform login with valid credentials from test data
  Then I should be redirected to my account dashboard