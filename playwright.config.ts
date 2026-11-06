import { defineConfig } from '@playwright/test';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
const data = process.env.GOLDEN_E2E_DATA_DIR ?? join(tmpdir(), `golden-e2e-${process.pid}`);
process.env.GOLDEN_E2E_DATA_DIR = data;
export default defineConfig({
  testDir: './tests/e2e', workers: 1, timeout: 30000, reporter: 'list',
  use: { baseURL: 'http://127.0.0.1:4318', viewport: { width: 1440, height: 1000 }, trace: 'retain-on-failure',
    launchOptions: { executablePath: process.env.PLAYWRIGHT_EXECUTABLE_PATH } },
  globalTeardown: './tests/e2e/cleanup.ts',
  webServer: { command: 'node dist/server/apps/server/src/index.js --production', url: 'http://127.0.0.1:4318/api/config', reuseExistingServer: false,
    env: { PORT: '4318', GENERATION_MODE: 'simulated', CAMPAIGN_DATA_DIR: data }, timeout: 30000 },
});
