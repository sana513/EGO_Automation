Feature: Login functionality for US locale

  Scenario: Login to my account on US site
    Given I open the website for "us"
    When I perform login with valid credentials
    Then I should be redirected to my account dashboard
