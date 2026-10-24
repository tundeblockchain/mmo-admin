import { defineConfig, devices } from '@playwright/test';

const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: './e2e/specs',
  fullyParallel: true,
  forbidOnly: isCi,
  retries: isCi ? 2 : 0,
  workers: isCi ? 1 : undefined,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'playwright-report' }]],
  outputDir: 'test-results',
  use: {
    baseURL: 'http://127.0.0.1:4173',
    screenshot: 'only-on-failure',
    trace: 'on-first-retry',
  },
  projects: [
    {
      name: 'chromium',
      testIgnore: /real-signin\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'real-auth',
      testMatch: /real-signin\.spec\.ts/,
      use: { ...devices['Desktop Chrome'] },
    },
  ],
  webServer: {
    command:
      isCi || process.env.E2E_SKIP_BUILD === '1'
        ? 'npm run preview -- --host 127.0.0.1 --port 4173'
        : `${process.env.E2E_REAL_AUTH === '1' ? 'npm run build:e2e:real' : 'npm run build:e2e'} && npm run preview -- --host 127.0.0.1 --port 4173`,
    url: 'http://127.0.0.1:4173',
    reuseExistingServer: !isCi,
    timeout: 120_000,
  },
});
