package com.employee.automation;

import java.io.File;
import java.io.IOException;
import java.net.Socket;

public class TestServerHelper {
    private static Process serverProcess = null;

    public static void startServerIfRequired() {
        if (isServerRunning()) {
            System.out.println("Vite React Server is already running on port 5173.");
            return;
        }

        System.out.println("Vite React Server is not running. Launching server...");
        try {
            File userDir = new File(System.getProperty("user.dir"));
            File projectDir;
            if (userDir.getName().equals("EmployeeAutomation") || userDir.getName().equals("CucumberDemo")) {
                projectDir = new File(userDir.getParent(), "employee_management");
            } else {
                projectDir = new File(userDir, "employee_management");
            }

            System.out.println("Project Directory: " + projectDir.getAbsolutePath());
            ProcessBuilder pb = new ProcessBuilder("cmd.exe", "/c", "npm run dev");
            pb.directory(projectDir);
            serverProcess = pb.start();
            System.out.println("Vite React Server started. Waiting for server to initialize...");
            
            // Wait up to 10 seconds for the port to open
            for (int i = 0; i < 20; i++) {
                if (isServerRunning()) {
                    System.out.println("Vite React Server is now up and listening.");
                    return;
                }
                Thread.sleep(500);
            }
            System.out.println("Warning: Vite React Server did not open port 5173 in time.");
        } catch (IOException | InterruptedException e) {
            System.err.println("Failed to start Vite React server: " + e.getMessage());
        }
    }

    public static void stopServer() {
        if (serverProcess != null) {
            System.out.println("Stopping local Vite React Server...");
            serverProcess.destroy();
            try {
                // Ensure the spawned cmd.exe and its child node processes are fully closed on Windows
                new ProcessBuilder("taskkill", "/F", "/T", "/PID", String.valueOf(serverProcess.toHandle().pid())).start();
            } catch (Exception e) {
                // Ignore if not killable
            }
            serverProcess = null;
        }
    }

    private static boolean isServerRunning() {
        try (Socket socket = new Socket("localhost", 5173)) {
            return true;
        } catch (IOException e) {
            return false;
        }
    }
}
