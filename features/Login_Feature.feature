Feature: Login Feature
Background:
  Given I open the website for "us"
 @login
  Scenario: Login to my account on US site
  When I perform login with valid credentials
  Then I should be redirected to my account dashboard