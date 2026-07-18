Feature: Login functionality

  Scenario: Launch browser and load employee management app
    Given the user opens Chrome browser
    When the user navigates to the employee management page
    Then the page title should contain "employee"
