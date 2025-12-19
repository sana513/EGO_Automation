# features/homepage.feature
Feature: Homepage
  As a user
  I want to verify the homepage elements and functionality
  So that I can ensure the homepage is working correctly

  Background:
    Given I navigate to the homepage
    And I decline the modal if it appears

  Scenario: Verify homepage header and navigation
    Then I should see the site logo
    And I should see the search bar
    And I should see all main navigation categories
    And I should see the "33% OFF FOR YOU" promotional banner

  Scenario: Verify main navigation categories
    Then I should see the following main categories:
      | New In       |
      | Winter       |
      | Clothing     |
      | Dresses      |
      | Co Ords      |
      | Tops         |
      | Bottoms      |
      | Shoes        |
      | Accessories  |
      | Sale         |

  Scenario: Verify subcategories for "New In"
    When I click on the main category "New In"
    Then I should see the following subcategories:
      | All New In        |
      | New in Clothing   |
      | New in Dresses    |

  Scenario: Verify subcategories for "Winter"
    When I click on the main category "Winter"
    Then I should see the following subcategories:
      | All Winter Edit       |
      | Coats & Jackets      |

  Scenario: Verify subcategories for "Clothing"
    When I click on the main category "Clothing"
    Then I should see the following subcategories:
      | All Clothing      |
      | All Dresses       |
  Scenario: Verify subcategories for "Dresses"
    When I click on the main category "Dresses"
    Then I should see the following subcategories:
      | All Dresses       |
      | Party Dresses     |

  Scenario: Verify main banners
    When I click on the main banner "New In"
    Then I should be navigated to the "New In" category page

    When I click on the main banner "Christmas"
    Then I should be navigated to the "Christmas" page

    When I click on the main banner "Sale"
    Then I should be navigated to the "Sale" page

 Scenario: Verify What's Hot! section
    When I scroll to Whats Hot section
    Then I should see product cards with images in Whats Hot section
    And I should see product names in Whats Hot section
    And I should see product prices in Whats Hot section
    And I should see "ADD" buttons in Whats Hot section

  Scenario: Verify promotional offers
    Then I should see promotional offers displayed
    And I should see discount percentages
    And I should see sale prices

  Scenario: Verify scrolling functionality
    When I scroll down 500
    Then I should see elements that appear after scrolling

    When I scroll up 500
    Then I should return to the top of the page
