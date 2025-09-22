import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from '@playwright/test';

import { testWithBackend } from './fixtures/test-with-backend';
import { PageAuthenticate } from './poms/authenticate';
import { PageOnboarding } from './poms/onboarding';
import { PageWelcome } from './poms/welcome';

const lang = 'vi';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

testWithBackend(
	'UAT-001-sign-up-and-onboard-employer',
	{
		tag: ['@uat', '@authentication'],
	},
	async ({ page, d1, mails }) => {
		// 1. User goes to authentication page, fill form, and submit
		const pomAuthenticate = new PageAuthenticate({ page, lang });
		const email = `test+uat-001@example.com`;
		await pomAuthenticate.goto();
		await pomAuthenticate.fill(email);
		await pomAuthenticate.submit();

		// 2. User receives and opens onboarding email
		await page.waitForTimeout(2000); // wait for backend queue to process
		await mails.openLatest(email, 'recruit-employer-onboard');

		// 4. User clicks onboarding link in email
		const onboardLink = page.getByRole('link', {
			name: lang === 'vi' ? 'Hoàn thiện hồ sơ' : 'Complete your profile',
		});
		await expect(onboardLink).toBeVisible();
		const link = await (await onboardLink.elementHandle())?.getAttribute('href');
		expect(link).not.toBeFalsy();

		// 10. User is redirected to onboarding page
		page.goto(link!);
		const pomOnboarding = new PageOnboarding({ page, lang });
		await pomOnboarding.waitForPage();
		await expect(pomOnboarding.accountMenu.locator).toBeHidden();

		// 11. User fills and submits onboarding form
		const profileData = {
			name: 'Company ABC',
			description: 'We are Company ABC, we do XYZ things.',
			image: path.join(__dirname, './assets/images/image-500x500.jpeg'),
			website: 'https://example.com',
		};
		await pomOnboarding.fill(profileData);
		pomOnboarding.submitForReview();

		// 12. User is redirected to welcome page
		const pomWelcome = new PageWelcome({ page, lang });
		await pomWelcome.waitForPage();
		await expect(pomWelcome.accountMenu.locator).toBeVisible();

		// 13. User goes to profile page and verify their data
		const pomProfile = await pomWelcome.accountMenu.goToProfile();
		const employer = await d1.query.employers.findFirst({
			where: (table, { eq }) => eq(table.email, email),
		});
		expect(employer).not.toBeFalsy();
		expect(employer!.email).toBe(email);
		expect(employer!.image).toBeTruthy();
		expect(employer!.emailVerified).toBe(true);
		await pomProfile.expectData({
			...profileData,
			email,
			image: new URL(page.url()).origin + employer!.image,
		});

		// 14. User logs out
		await pomProfile.accountMenu.logout();
	},
);
