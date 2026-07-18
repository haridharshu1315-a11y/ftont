package com.employee.automation;

import io.cucumber.testng.AbstractTestNGCucumberTests;
import io.cucumber.testng.CucumberOptions;
import org.testng.annotations.AfterClass;
import org.testng.annotations.BeforeClass;

@CucumberOptions(
    features = "src/test/resources/features",
    glue = "com.employee.automation.stepdefinitions",
    plugin = {
        "pretty",
        "html:target/cucumber-reports.html"
    }
)
public class RunCucumberTest extends AbstractTestNGCucumberTests {

    @BeforeClass(alwaysRun = true)
    public void startServer() {
        System.out.println("RunCucumberTest: Starting React server if not running...");
        TestServerHelper.startServerIfRequired();
    }

    @AfterClass(alwaysRun = true)
    public void stopServer() {
        System.out.println("RunCucumberTest: Shutting down local React server and closing browser...");
        TestServerHelper.stopServer();
        com.employee.automation.stepdefinitions.StepDefinitions.quitDriver();
    }
}
