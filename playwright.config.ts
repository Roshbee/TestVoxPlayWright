import { defineConfig, devices } from '@playwright/test';

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
// import dotenv from 'dotenv';
// import path from 'path';
// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests', // Ensure your test files are in the 'tests' directory
  fullyParallel: true, // Run tests in files in parallel
  forbidOnly: !!process.env.CI, // Fail the build on CI if you accidentally left test.only in the source code
  retries: process.env.CI ? 2 : 0, // Retry on CI only
  workers: process.env.CI ? 1 : undefined, // Opt out of parallel tests on CI
  reporter: 'html', // Reporter to generate HTML reports
  use: {
    // baseURL: 'http://127.0.0.1:3000', // Uncomment this if you need to set a base URL
    trace: 'on-first-retry', // Collect trace when retrying the failed test
  },

  // Configure projects for major browsers
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },

    // Test against mobile viewports (uncomment if you want to test on mobile)
    {
      // name: 'Mobile Chrome',
      // use: { ...devices['Pixel 5'] },
    },
    {
      // name: 'Mobile Safari',
      // use: { ...devices['iPhone 12'] },
    },

    // Test against branded browsers (uncomment if you want to test on Edge or Chrome)
    {
      // name: 'Microsoft Edge',
      // use: { ...devices['Desktop Edge'], channel: 'msedge' },
    },
    {
      name: 'Google Chrome',
      use: { ...devices['Desktop Chrome'], channel: 'chrome' },
    },
  ],

  // Run your local dev server before starting the tests (uncomment if necessary)
  // webServer: {
  //   command: 'npm run start',  // Command to start your local dev server
  //   url: 'http://127.0.0.1:3000', // URL where your server is running
  //   reuseExistingServer: !process.env.CI, // Only reuse the server when not running in CI
  // },
});
