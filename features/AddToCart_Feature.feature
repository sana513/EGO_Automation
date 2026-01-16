Feature: Add To Cart Feature
Background:
    Given I open the website for "us"
@addtocart
Scenario: Update cart and proceed to checkout
  Given I open the website for "us"
  And I open a random product from PLP
  When I select any available size
  And I add the product to the bag
  Then I open the cart page
  When I update the quantity randomly
  And I update the product size randomly
  And I add the product to wishlist
  And I apply the coupon code "R5D48EF48"
  And I proceed to checkout