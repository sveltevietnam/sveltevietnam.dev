import { test } from '@playwright/test';

import { PageObjectModel } from '../utils';

test('user can see translated messages', async ({ page }) => {
	const pom = new PageObjectModel(page);

	// user goes to the app
	await pom.goto();

	// user sees correct translation
	await pom.expect('en');

	// user changes language to Vietnamese
	const responsePromise = page.waitForResponse(/_app\/remote\/\w*\/t/);
	await pom.changeLanguage('vi');
	await responsePromise;

	// user sees correct updated translation
	await pom.expect('vi');
});
