import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, type Page, type Locator } from '@playwright/test';
import * as schema from '@sveltevietnam/backend/db/schema';
import wrangler from '@sveltevietnam/backend/wrangler.json' with { type: 'json' };

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export function getBackendConfig() {
	const id = wrangler.env.test.d1_databases[0].database_id;
	const cwd = path.resolve(__dirname, '../../../workers/backend');
	return { database: { id, schema }, cwd };
}

export async function expectEmailInput(page: Page): Promise<Locator> {
	const input = page.getByRole('textbox', { name: 'Email' });
	await expect(input).toBeVisible();
	return input;
}

export function generateTimestampedEmail(): string {
	const timestamp = Date.now();
	return `e2e+${timestamp}@example.com`;
}
