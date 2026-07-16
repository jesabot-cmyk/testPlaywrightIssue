import { defineConfig, devices } from '@playwright/test';
import * as http from 'http';

let server: http.Server;

export default defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: false,
  retries: 0,
  repeatEach: 10,
  workers: 1,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:3333',
    trace: 'on-first-retry',
  },

  webServer: {
    command: 'node tests/server.js',
    url: 'http://localhost:3333',
    reuseExistingServer: false,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chromium'] },
    },
  ],
});
