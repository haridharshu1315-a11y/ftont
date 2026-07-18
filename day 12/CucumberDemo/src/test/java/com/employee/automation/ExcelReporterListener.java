package com.employee.automation;

import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.testng.*;
import org.testng.xml.XmlSuite;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.text.SimpleDateFormat;
import java.util.*;

public class ExcelReporterListener implements IReporter {

    @Override
    public void generateReport(List<XmlSuite> xmlSuites, List<ISuite> suites, String outputDirectory) {
        Workbook workbook = new XSSFWorkbook();
        Sheet sheet = workbook.createSheet("Test Execution Report");

        // Enable grid lines
        sheet.setDisplayGridlines(true);

        // Define fonts
        Font defaultFont = workbook.createFont();
        defaultFont.setFontName("Segoe UI");
        defaultFont.setFontHeightInPoints((short) 10);

        Font boldFont = workbook.createFont();
        boldFont.setFontName("Segoe UI");
        boldFont.setFontHeightInPoints((short) 10);
        boldFont.setBold(true);

        Font headerFont = workbook.createFont();
        headerFont.setFontName("Segoe UI");
        headerFont.setFontHeightInPoints((short) 11);
        headerFont.setBold(true);
        headerFont.setColor(IndexedColors.WHITE.getIndex());

        // Header style (Navy blue fill, white bold font)
        CellStyle headerStyle = workbook.createCellStyle();
        headerStyle.setFont(headerFont);
        headerStyle.setFillForegroundColor(IndexedColors.DARK_BLUE.getIndex());
        headerStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        headerStyle.setAlignment(HorizontalAlignment.LEFT);
        headerStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        setBorders(headerStyle);

        // Metadata style
        CellStyle metaLabelStyle = workbook.createCellStyle();
        metaLabelStyle.setFont(boldFont);
        
        CellStyle metaValueStyle = workbook.createCellStyle();
        metaValueStyle.setFont(defaultFont);

        // Data style
        CellStyle dataStyle = workbook.createCellStyle();
        dataStyle.setFont(defaultFont);
        dataStyle.setWrapText(true);
        dataStyle.setVerticalAlignment(VerticalAlignment.TOP);
        setBorders(dataStyle);

        // Status Styles
        CellStyle passStyle = workbook.createCellStyle();
        passStyle.setFont(boldFont);
        passStyle.setAlignment(HorizontalAlignment.CENTER);
        passStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        passStyle.setFillForegroundColor(IndexedColors.LIGHT_GREEN.getIndex());
        passStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        setBorders(passStyle);

        CellStyle failStyle = workbook.createCellStyle();
        failStyle.setFont(boldFont);
        failStyle.setAlignment(HorizontalAlignment.CENTER);
        failStyle.setVerticalAlignment(VerticalAlignment.CENTER);
        failStyle.setFillForegroundColor(IndexedColors.ROSE.getIndex()); // rose or coral background for failure
        failStyle.setFillPattern(FillPatternType.SOLID_FOREGROUND);
        setBorders(failStyle);

        // Write metadata
        int rowIdx = 0;
        String currentDate = new SimpleDateFormat("2026-07-18").format(new Date()); // Match local timezone/metadata
        
        createMetaRow(sheet, rowIdx++, "Project name:", "PeopleHub Portal Automation", metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "Project Manager:", "Hariharan", metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "Test manager:", "Hariharan", metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "Tester name:", "Hariharan Dev", metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "Project Assigned:", currentDate, metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "Module Name:", "Employee Directory, Search & Filter, CRUD Operations", metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "End Date:", currentDate, metaLabelStyle, metaValueStyle);
        createMetaRow(sheet, rowIdx++, "Priority:", "High", metaLabelStyle, metaValueStyle);

        rowIdx++; // Blank row

        // Table Header
        Row headerRow = sheet.createRow(rowIdx++);
        headerRow.setHeightInPoints(26);
        String[] headers = {"Testcase ID", "Test Scenario", "Test Steps", "TestData", "Expected Result", "Actual Result", "Status"};
        for (int i = 0; i < headers.length; i++) {
            Cell cell = headerRow.createCell(i);
            cell.setCellValue(headers[i]);
            cell.setCellStyle(headerStyle);
        }

        // Collect all test results
        List<ITestResult> allResults = new ArrayList<>();
        for (ISuite suite : suites) {
            Map<String, ISuiteResult> suiteResults = suite.getResults();
            for (ISuiteResult sr : suiteResults.values()) {
                ITestContext tc = sr.getTestContext();
                allResults.addAll(tc.getPassedTests().getAllResults());
                allResults.addAll(tc.getFailedTests().getAllResults());
                allResults.addAll(tc.getSkippedTests().getAllResults());
            }
        }

        // Sort results by testcase ID using our helper
        allResults.sort((r1, r2) -> {
            String id1 = getTestcaseId(r1);
            String id2 = getTestcaseId(r2);
            return id1.compareTo(id2);
        });

        // Write test results
        for (ITestResult result : allResults) {
            String testcaseId = "";
            String scenario = "";
            String steps = "";
            String testData = "";
            String expectedResult = "";
            String actualResult = "";

            // Check if this is a Cucumber scenario run
            if (result.getParameters() != null && result.getParameters().length >= 2) {
                String scName = result.getParameters()[0].toString().replace("\"", "");
                String ftName = result.getParameters()[1].toString().replace("\"", "");
                String errMsg = result.getThrowable() != null ? result.getThrowable().getMessage() : "Unknown error";

                if (scName.contains("Launch browser and load employee management app")) {
                    testcaseId = "TC#1";
                    scenario = "Launch Browser and Navigate to Application";
                    steps = "1. Launch Chrome Browser.\n2. Navigate to URL: http://localhost:5173.\n3. Verify page title contains 'employee'.";
                    testData = "URL: http://localhost:5173";
                    expectedResult = "Application loaded successfully and title contains 'employee'.";
                    actualResult = result.getStatus() == ITestResult.SUCCESS ? 
                        "Successfully loaded directory application. Chrome navigated automatically." : 
                        "Failed to navigate: " + errMsg;
                } else if (scName.contains("Add a new employee successfully")) {
                    testcaseId = "TC#2";
                    scenario = "Add employee record";
                    steps = "1. Click Add employee button.\n2. Fill Name, Email, Dept, Role, Salary, DOB, Date of hire.\n3. Submit and verify success confirmation notification.";
                    testData = "Name: John Doe Automation | Dept: Marketing | Role: Automation Engineer | Salary: $85000";
                    expectedResult = "Employee record is saved and a success notification toast is displayed.";
                    actualResult = result.getStatus() == ITestResult.SUCCESS ? 
                        "Added new employee successfully. Toast notification verified." : 
                        "Failed to add employee: " + errMsg;
                } else if (scName.contains("Search for the employee")) {
                    testcaseId = "TC#3";
                    scenario = "Search directory and filter roster";
                    steps = "1. Type target employee name in search bar.\n2. Confirm search table filters rows and isolates record.";
                    testData = "Search Query: John Doe Automation";
                    expectedResult = "Table filters down to rows matching the search term.";
                    actualResult = result.getStatus() == ITestResult.SUCCESS ? 
                        "Table filtered successfully. Roster isolates row containing name 'John Doe Automation'." : 
                        "Failed to filter: " + errMsg;
                } else if (scName.contains("Edit employee details")) {
                    testcaseId = "TC#4";
                    scenario = "Edit employee details";
                    steps = "1. Click dot action menu.\n2. Click Edit employee.\n3. Change role and salary.\n4. Submit and verify updated table values.";
                    testData = "Role: Senior Automation Architect | Salary: 125000";
                    expectedResult = "Employee record role and salary are updated and visible in table.";
                    actualResult = result.getStatus() == ITestResult.SUCCESS ? 
                        "Employee record updated. Verified new values: 'Senior Automation Architect' and '$125,000' in table row." : 
                        "Failed to edit: " + errMsg;
                } else if (scName.contains("Delete employee record")) {
                    testcaseId = "TC#5";
                    scenario = "Delete employee record";
                    steps = "1. Open action menu.\n2. Click Delete employee.\n3. Verify deletion toast.\n4. Verify empty directory search results.";
                    testData = "Name: John Doe Automation";
                    expectedResult = "Employee is removed and table displays 'no employees found' empty state.";
                    actualResult = result.getStatus() == ITestResult.SUCCESS ? 
                        "Employee deleted successfully. Empty state verified." : 
                        "Failed to delete: " + errMsg;
                } else {
                    testcaseId = "TC#Misc";
                    scenario = scName;
                    steps = "Cucumber Scenario step executions.";
                    testData = "Feature: " + ftName;
                    expectedResult = "Scenario runs to completion.";
                    actualResult = result.getStatus() == ITestResult.SUCCESS ? "Success" : "Failed: " + errMsg;
                }
            } else {
                // Fallback for regular TestNG tests
                testcaseId = (String) result.getAttribute("testcaseId");
                if (testcaseId == null || testcaseId.isEmpty()) {
                    testcaseId = result.getMethod().getMethodName();
                }

                scenario = (String) result.getAttribute("scenario");
                if (scenario == null) scenario = result.getMethod().getDescription();
                if (scenario == null) scenario = "Execution of " + result.getMethod().getMethodName();

                steps = (String) result.getAttribute("steps");
                if (steps == null) steps = "1. Execute test method: " + result.getMethod().getMethodName();

                testData = (String) result.getAttribute("testData");
                if (testData == null) testData = "N/A";

                expectedResult = (String) result.getAttribute("expectedResult");
                if (expectedResult == null) expectedResult = "Assert success status";

                actualResult = (String) result.getAttribute("actualResult");
                if (actualResult == null) {
                    if (result.getStatus() == ITestResult.SUCCESS) {
                        actualResult = "Verified successfully.";
                    } else if (result.getStatus() == ITestResult.FAILURE) {
                        actualResult = "Failed: " + (result.getThrowable() != null ? result.getThrowable().getMessage() : "Unknown error");
                    } else {
                        actualResult = "Skipped.";
                    }
                }
            }

            String status = "Fail";
            if (result.getStatus() == ITestResult.SUCCESS) status = "Pass";
            else if (result.getStatus() == ITestResult.SKIP) status = "Skip";

            Row row = sheet.createRow(rowIdx++);
            row.setHeightInPoints(60); // taller rows for nice vertical space

            createCell(row, 0, testcaseId, dataStyle);
            createCell(row, 1, scenario, dataStyle);
            createCell(row, 2, steps, dataStyle);
            createCell(row, 3, testData, dataStyle);
            createCell(row, 4, expectedResult, dataStyle);
            createCell(row, 5, actualResult, dataStyle);

            Cell statusCell = row.createCell(6);
            statusCell.setCellValue(status);
            statusCell.setCellStyle(status.equals("Pass") ? passStyle : failStyle);
        }

        // Set column widths
        sheet.setColumnWidth(0, 15 * 256); // TC ID
        sheet.setColumnWidth(1, 30 * 256); // Scenario
        sheet.setColumnWidth(2, 45 * 256); // Steps
        sheet.setColumnWidth(3, 25 * 256); // TestData
        sheet.setColumnWidth(4, 35 * 256); // Expected
        sheet.setColumnWidth(5, 35 * 256); // Actual
        sheet.setColumnWidth(6, 12 * 256); // Status

        // Ensure reports directory exists
        File reportsDir = new File("reports");
        if (!reportsDir.exists()) {
            reportsDir.mkdirs();
        }

        // File location inside the EmployeeAutomation reports folder
        File outFile = new File(reportsDir, "test-execution-report.xlsx");
        try (FileOutputStream fos = new FileOutputStream(outFile)) {
            workbook.write(fos);
            System.out.println("Excel Test Execution Report generated successfully at: " + outFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Error saving Excel report: " + e.getMessage());
        }

        // Also save to root workspace folder for easy access in VS Code explorer
        File parentDir = new File(System.getProperty("user.dir"));
        File rootOutFile = (parentDir.getName().equals("EmployeeAutomation") || parentDir.getName().equals("CucumberDemo")) ? 
            new File(parentDir.getParent(), "test-execution-report.xlsx") : 
            new File(parentDir, "test-execution-report.xlsx");
        try (FileOutputStream fos = new FileOutputStream(rootOutFile)) {
            workbook.write(fos);
            System.out.println("Excel Test Execution Report copied to workspace root: " + rootOutFile.getAbsolutePath());
        } catch (IOException e) {
            System.err.println("Error saving Excel report to root workspace: " + e.getMessage());
        } finally {
            try {
                workbook.close();
            } catch (IOException e) {
                // ignore
            }
        }
    }

    private void createMetaRow(Sheet sheet, int rowIdx, String label, String value, CellStyle labelStyle, CellStyle valStyle) {
        Row row = sheet.createRow(rowIdx);
        Cell cell0 = row.createCell(0);
        cell0.setCellValue(label);
        cell0.setCellStyle(labelStyle);

        Cell cell1 = row.createCell(1);
        cell1.setCellValue(value);
        cell1.setCellStyle(valStyle);
    }

    private void createCell(Row row, int colIdx, String value, CellStyle style) {
        Cell cell = row.createCell(colIdx);
        cell.setCellValue(value);
        cell.setCellStyle(style);
    }

    private void setBorders(CellStyle style) {
        style.setBorderTop(BorderStyle.THIN);
        style.setBorderBottom(BorderStyle.THIN);
        style.setBorderLeft(BorderStyle.THIN);
        style.setBorderRight(BorderStyle.THIN);
        style.setTopBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setBottomBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setLeftBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
        style.setRightBorderColor(IndexedColors.GREY_40_PERCENT.getIndex());
    }

    private String getTestcaseId(ITestResult result) {
        String testcaseId = (String) result.getAttribute("testcaseId");
        if (testcaseId != null && !testcaseId.isEmpty()) {
            return testcaseId;
        }
        if (result.getParameters() != null && result.getParameters().length >= 2) {
            String scName = result.getParameters()[0].toString().replace("\"", "");
            if (scName.contains("Launch browser and load employee management app")) return "TC#1";
            if (scName.contains("Add a new employee successfully")) return "TC#2";
            if (scName.contains("Search for the employee")) return "TC#3";
            if (scName.contains("Edit employee details")) return "TC#4";
            if (scName.contains("Delete employee record")) return "TC#5";
        }
        return result.getMethod().getMethodName();
    }
}
