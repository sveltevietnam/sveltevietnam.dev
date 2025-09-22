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
	async ({ page, d1, kvMails }) => {
		const pomAuthenticate = new PageAuthenticate({ page, lang });

		// 1. Go to authentication page, fill form, and submit
		await pomAuthenticate.goto();
		await pomAuthenticate.fill();
		await pomAuthenticate.submit();

		// 2. User receives onboarding email
		await page.waitForTimeout(1000);
		const mail = await d1.query.mails.findFirst({
			where: (table, { eq }) => eq(table.to, pomAuthenticate.data.email),
		});
		expect(mail).not.toBeFalsy();

		const mailHtml = await kvMails.getById(mail!.id);
		expect(mailHtml).not.toBeFalsy();

		// 3. User opens the email
		await page.evaluate((mailHtml) => {
			document.documentElement.innerHTML = mailHtml!;
		}, mailHtml);

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
			where: (table, { eq }) => eq(table.email, pomAuthenticate.data.email),
		});
		expect(employer).not.toBeFalsy();
		expect(employer!.email).toBe(pomAuthenticate.data.email);
		expect(employer!.image).toBeTruthy();
		expect(employer!.emailVerified).toBe(true);
		await pomProfile.expectData({
			...profileData,
			email: pomAuthenticate.data.email,
			image: new URL(page.url()).origin + employer!.image,
		});

		// 14. User logs out
		await pomProfile.accountMenu.logout();
	},
);
