# Employee Management Automation Suite

This project contains Selenium + TestNG browser automation tests for the Employee Management application. It is configured to run tests using Google Chrome.

## Project Structure
- `src/main/java/com/employee/automation/App.java`: Main application helper class.
- `src/test/java/com/employee/automation/LaunchBrowserTest.java`: Verifies Selenium ChromeDriver launch and application loading.
- `src/test/java/com/employee/automation/AppTest.java`: Basic sanity testing assertions.
- `src/test/java/com/employee/automation/AdvanceTestingTest.java`: Performs automated E2E employee CRUD workflow:
  1. Navigation & elements verification.
  2. Adding an employee.
  3. Searching for the employee.
  4. Editing the employee.
  5. Deleting the employee.
  6. Capturing logs & exporting reports.

## Prerequisites
- **Java JDK 17** or higher.
- **Apache Maven 3.9** or higher.
- **Google Chrome** browser installed on the system.

## How to Run
1. Ensure the React Dev Server is running in the `employee_management` folder:
   ```bash
   cd employee_management
   npm run dev
   ```
2. In a separate terminal, run the automation test suite inside the `EmployeeAutomation` folder:
   ```bash
   cd EmployeeAutomation
   mvn clean test
   ```
3. View the generated test report at `EmployeeAutomation/reports/extent-report.html`.
