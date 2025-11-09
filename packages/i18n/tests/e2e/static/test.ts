import { test } from '@playwright/test';

import { PageObjectModel } from '../utils';

import * as m from './src/lib/i18n/generated/messages';

test('user can see translated messages', async ({ page }) => {
	const pom = new PageObjectModel(page, m);

	// user goes to the app
	await pom.goto();

	// user sees correct translation
	await pom.expect('en');

	// user changes language to Vietnamese
	await pom.changeLanguage('vi');

	// user sees correct updated translation
	await pom.expect('vi');
});
