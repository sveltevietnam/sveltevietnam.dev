import { test, expect, type Page, type Locator } from '@playwright/test';

import * as p from '../src/data/routes/generated';

async function expectEmailInput(page: Page): Promise<Locator> {
	const input = page.getByRole('textbox', { name: 'Email' });
	await expect(input).toBeVisible();
	return input;
}

function generateTimestampedEmail(): string {
	const timestamp = Date.now();
	return `e2e+${timestamp}@example.com`;
}

test('/authenticate', async ({ page }) => {
	const path = p['/:lang/authenticate']({ lang: 'vi' });
	await page.goto(path);

	const emailInput = await expectEmailInput(page);
	await emailInput.fill(generateTimestampedEmail());

	// TODO: implement the rest of the test
	// const submitButton = page.getByRole('button', { })
});
