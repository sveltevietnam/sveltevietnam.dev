import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { defineConfig, devices } from '@playwright/test';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// NOTE: Guide for installing dependencies on Arch Linux
// https://github.com/microsoft/playwright/issues/2621#issuecomment-2083083392
export default defineConfig({
	testMatch: /(.+\.)?(uat)\.[jt]s/,
	webServer: [
		{
			name: 'Recruit',
			command: 'pnpm build:test && pnpm dev:wrangler:test',
			cwd: path.resolve(__dirname),
			port: 5007,
			reuseExistingServer: !process.env.CI,
		},
		{
			name: 'Backend',
			command: 'pnpm build:test && pnpm dev:wrangler',
			cwd: path.resolve(__dirname, '../../workers/backend'),
			port: 5006,
			reuseExistingServer: !process.env.CI,
		},
	],
	projects: [
		{
			name: 'chromium',
			use: {
				baseURL: 'http://localhost:5007',
				...devices['Desktop Chrome'],
				screenshot: 'only-on-failure',
				trace: 'retain-on-failure',
			},
		},
	],
});
