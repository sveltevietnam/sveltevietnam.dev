import { test } from '@playwright/test';

import { PageObjectModel } from '../utils';

test('on ssr-ed page, user can see translated messages', async ({ page }) => {
	const pom = new PageObjectModel(page, '/query');

	// user goes to the app
	await pom.goto();

	// user sees correct translation
	await pom.expect('en');

	// user changes language to Vietnamese
	const responsePromise = page.waitForResponse(/_app\/remote\/\w*\/query/);
	await pom.changeLanguage('vi');
	await responsePromise;

	// user sees correct updated translation
	await pom.expect('vi');
});

test('on prerendered page, user can see translated messages', async ({ page }) => {
	const pom = new PageObjectModel(page, '/prerender');

	// user goes to the app
	await pom.goto();

	// user sees correct translation
	await pom.expect('en');

	// user changes language to Vietnamese
	const responsePromise = page.waitForResponse(/_app\/remote\/\w*\/prerender/);
	await pom.changeLanguage('vi');
	await responsePromise;

	// user sees correct updated translation
	await pom.expect('vi');
});
