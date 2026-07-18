package com.employee.automation.stepdefinitions;

import io.cucumber.datatable.DataTable;
import io.cucumber.java.After;
import io.cucumber.java.Before;
import io.cucumber.java.en.And;
import io.cucumber.java.en.Given;
import io.cucumber.java.en.Then;
import io.cucumber.java.en.When;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.testng.Assert;

import java.time.Duration;
import java.util.List;
import java.util.Map;

public class StepDefinitions {
    public static WebDriver driver;
    public static WebDriverWait wait;
    private final String baseUrl = "http://localhost:5173";

    @Before
    public void setUp() {
        // Hook run before every scenario
    }

    @Given("the user opens Chrome browser")
    public void the_user_opens_chrome_browser() {
        if (driver == null) {
            ChromeOptions options = new ChromeOptions();
            options.addArguments("--start-maximized");
            options.addArguments("--remote-allow-origins=*");
            driver = new ChromeDriver(options);
            wait = new WebDriverWait(driver, Duration.ofSeconds(10));
        }
    }

    @When("the user navigates to the employee management page")
    public void the_user_navigates_to_the_employee_management_page() {
        if (driver.getCurrentUrl() == null || !driver.getCurrentUrl().startsWith(baseUrl)) {
            driver.get(baseUrl);
        }
    }

    @Then("the page title should contain {string}")
    public void the_page_title_should_contain(String expectedTitlePart) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("search-input")));
        String pageTitle = driver.getTitle();
        Assert.assertTrue(pageTitle.toLowerCase().contains(expectedTitlePart.toLowerCase()),
                "Page title should contain '" + expectedTitlePart + "'");
    }

    @When("the user clicks on {string} button")
    public void the_user_clicks_on_button(String buttonName) {
        WebElement addButton = wait.until(ExpectedConditions.elementToBeClickable(By.id("add-employee-btn")));
        addButton.click();
    }

    @And("fills the employee form with:")
    public void fills_the_employee_form_with(DataTable dataTable) {
        Map<String, String> data = dataTable.asMap(String.class, String.class);
        
        WebElement nameInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("emp-name")));
        WebElement emailInput = driver.findElement(By.id("emp-email"));
        WebElement deptSelect = driver.findElement(By.id("emp-department"));
        WebElement roleInput = driver.findElement(By.id("emp-role"));
        WebElement salaryInput = driver.findElement(By.id("emp-salary"));
        WebElement dobInput = driver.findElement(By.id("emp-dob"));
        WebElement dohInput = driver.findElement(By.id("emp-date-of-hire"));

        nameInput.sendKeys(data.get("name"));
        emailInput.sendKeys(data.get("email"));
        
        Select selectDept = new Select(deptSelect);
        selectDept.selectByVisibleText(data.get("department"));
        
        roleInput.sendKeys(data.get("role"));
        salaryInput.sendKeys(data.get("salary"));

        // Trigger React state bindings for date fields
        setReactInputValue(dobInput, data.get("dob"));
        setReactInputValue(dohInput, data.get("date_of_hire"));
    }

    @And("submits the form")
    public void submits_the_form() {
        WebElement submitButton = driver.findElement(By.id("submit-employee-btn"));
        submitButton.click();
        wait.until(ExpectedConditions.invisibilityOfElementLocated(By.className("modal-backdrop")));
    }

    @Then("a success notification {string} is displayed")
    public void a_success_notification_is_displayed(String expectedMessagePart) {
        WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("toast")));
        String toastText = toast.getText();
        Assert.assertTrue(toastText.toLowerCase().contains(expectedMessagePart.toLowerCase()),
                "Toast notification did not contain '" + expectedMessagePart + "'");
    }

    @When("the user searches for {string}")
    public void the_user_searches_for(String name) {
        WebElement searchInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("search-input")));
        searchInput.clear();
        searchInput.sendKeys(name);
        // Wait for search result row to be visible containing the name
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.xpath("//table/tbody"), name));
    }

    @Then("the table should display the employee {string} with email {string} and department {string}")
    public void the_table_should_display_the_employee_with_email_and_department(String name, String email, String dept) {
        List<WebElement> rows = driver.findElements(By.xpath("//table/tbody/tr"));
        Assert.assertTrue(rows.size() >= 1, "Roster should show at least one matching employee row");
        String firstRowText = rows.get(0).getText();
        Assert.assertTrue(firstRowText.contains(name), "Row did not contain employee name: " + name);
        Assert.assertTrue(firstRowText.contains(email), "Row did not contain employee email: " + email);
        Assert.assertTrue(firstRowText.contains(dept), "Row did not contain employee department: " + dept);
    }

    @And("opens the action menu for {string}")
    public void opens_the_action_menu_for(String name) {
        WebElement actionButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//table/tbody/tr[1]//button[contains(@id, 'action-menu-')]")));
        actionButton.click();
    }

    @And("clicks on Edit employee")
    public void clicks_on_edit_employee() {
        WebElement editButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//table/tbody/tr[1]//button[contains(@id, 'edit-btn-')]")));
        editButton.click();
    }

    @And("updates the role to {string} and salary to {string}")
    public void updates_the_role_to_and_salary_to(String newRole, String newSalary) {
        WebElement roleInput = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("emp-role")));
        roleInput.clear();
        roleInput.sendKeys(newRole);

        WebElement salaryInput = driver.findElement(By.id("emp-salary"));
        salaryInput.clear();
        salaryInput.sendKeys(newSalary);
    }

    @Then("the table should reflect the updated role {string} and salary {string} for {string}")
    public void the_table_should_reflect_the_updated_role_and_salary_for(String role, String salary, String name) {
        wait.until(ExpectedConditions.textToBePresentInElementLocated(By.xpath("//table/tbody/tr[1]"), role));
        String rowText = driver.findElement(By.xpath("//table/tbody/tr[1]")).getText();
        Assert.assertTrue(rowText.contains(role), "Row role mismatch");
        Assert.assertTrue(rowText.contains(salary.replace("$", "").trim()), "Row salary mismatch");
    }

    @And("clicks on Delete employee")
    public void clicks_on_delete_employee() {
        WebElement deleteButton = wait.until(ExpectedConditions.elementToBeClickable(
                By.xpath("//table/tbody/tr[1]//button[contains(@id, 'delete-btn-')]")));
        deleteButton.click();
    }

    @Then("a removal notification is displayed")
    public void a_removal_notification_is_displayed() {
        WebElement toast = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("toast")));
        Assert.assertTrue(toast.getText().toLowerCase().contains("removed"), "Toast text was: " + toast.getText());
    }

    @And("searching for {string} shows no employees found")
    public void searching_for_shows_no_employees_found(String name) {
        WebElement searchInput = driver.findElement(By.id("search-input"));
        searchInput.clear();
        searchInput.sendKeys(name);
        
        WebElement emptyState = wait.until(ExpectedConditions.visibilityOfElementLocated(By.className("empty-state")));
        Assert.assertTrue(emptyState.getText().toLowerCase().contains("no employees found"),
                "Expected empty state not shown. Found: " + emptyState.getText());
    }

    @After
    public void tearDown() {
        // Do not quit driver after each scenario to preserve JS in-memory state
    }

    public static void quitDriver() {
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception e) {
                // ignore
            }
            driver = null;
            wait = null;
        }
    }

    private void setReactInputValue(WebElement element, String value) {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        String script = 
            "var val = arguments[1];" +
            "var el = arguments[0];" +
            "var nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;" +
            "nativeSetter.call(el, val);" +
            "var ev = new Event('input', { bubbles: true });" +
            "el.dispatchEvent(ev);";
        js.executeScript(script, element, value);
    }
}
