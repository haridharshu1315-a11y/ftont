Feature: Employee Workspace CRUD Operations

  Background:
    Given the user opens Chrome browser
    And the user navigates to the employee management page

  Scenario: Add a new employee successfully
    When the user clicks on "Add employee" button
    And fills the employee form with:
      | name         | John Doe Automation   |
      | email        | johndoe.auto@gmail.com|
      | department   | Marketing             |
      | role         | Automation Engineer   |
      | salary       | 85000                 |
      | dob          | 1994-08-25            |
      | date_of_hire | 2024-07-01            |
    And submits the form
    Then a success notification "successfully" is displayed

  Scenario: Search for the employee
    When the user searches for "John Doe Automation"
    Then the table should display the employee "John Doe Automation" with email "johndoe.auto@gmail.com" and department "Marketing"

  Scenario: Edit employee details
    When the user searches for "John Doe Automation"
    And opens the action menu for "John Doe Automation"
    And clicks on Edit employee
    And updates the role to "Senior Automation Architect" and salary to "125000"
    And submits the form
    Then the table should reflect the updated role "Senior Automation Architect" and salary "$125,000" for "John Doe Automation"

  Scenario: Delete employee record
    When the user searches for "John Doe Automation"
    And opens the action menu for "John Doe Automation"
    And clicks on Delete employee
    Then a removal notification is displayed
    And searching for "John Doe Automation" shows no employees found
