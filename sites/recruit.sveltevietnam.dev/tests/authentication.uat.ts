import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from '@playwright/test';
import { count, eq } from 'drizzle-orm';

import { testWithBackend, schema } from './fixtures/test-with-backend';
import { PageAuthenticate } from './poms/authenticate';
import { PageMail } from './poms/mail';
import { PageOnboarding } from './poms/onboarding';
import { PagePostings } from './poms/postings';
import { generateTimestampedEmail, getWranglerVars } from './utils';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

testWithBackend.use({ lang: 'vi' });

testWithBackend.describe(() => {
	const test = testWithBackend.extend<{ email: string }>({
		email: async ({ page, lang, mails, d1 }, use) => {
			const email = generateTimestampedEmail();
			// User goes to authentication page, fill form, and submit
			const pomAuthenticate = new PageAuthenticate({ page, lang });
			await pomAuthenticate.goto();
			await pomAuthenticate.fill(email);
			await pomAuthenticate.continue('signup');

			// User receives and get to onboarding page via email
			const pomMail = new PageMail({ page, lang, mails, d1 });
			await pomMail.onboard(email);

			// User is redirected to onboarding page
			const pomOnboarding = new PageOnboarding({ page, lang });
			await pomOnboarding.waitForPage();
			await expect(pomOnboarding.accountMenu.locator).toBeHidden();

			await use(email);
		},
	});

	test(
		'UAT-AUTH-001: User can sign up and be onboarded',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, d1, email }) => {
			const pomOnboarding = new PageOnboarding({ page, lang });

			// User fills and submits onboarding form, and is redirected to welcome page
			const profileData = {
				name: 'Company ABC',
				description: 'We are Company ABC, we do XYZ things.',
				image: path.join(__dirname, './assets/images/image-500x500.jpeg'),
				website: 'https://example.com',
			};
			await pomOnboarding.fill(profileData);
			const pomWelcome = await pomOnboarding.submitForReview();

			// User goes to profile page and verify their data
			const pomProfile = await pomWelcome.accountMenu.goToProfile();
			const employer = await d1.query.employers.findFirst({
				where: (table, { eq }) => eq(table.email, email),
			});
			expect(employer).not.toBeFalsy();
			expect(employer!.email).toBe(email);
			expect(employer!.image).toBeTruthy();
			expect(employer!.emailVerified).toBe(true);
			expect(employer!.onboardedAt).toBeTruthy();
			await pomProfile.expectData({
				...profileData,
				email,
				image: new URL(page.url()).origin + employer!.image,
			});

			// 3. User logs out
			await pomProfile.accountMenu.logout();
		},
	);

	test(
		'UAT-AUTH-002: User can log out during onboarding and sign up again',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, mails, d1, email }) => {
			// User logs out during onboarding and is redirected to authenticate page
			const pomOnboarding = new PageOnboarding({ page, lang });
			const pomAuthenticate = await pomOnboarding.useAnotherAccount();

			// User signs up again
			await pomAuthenticate.fill(email);
			await pomAuthenticate.continue('signup');

			// User receives and opens email
			const pomMail = new PageMail({ page, lang, mails, d1 });
			await pomMail.onboard(email);

			// User is redirected to onboarding page
			await pomOnboarding.waitForPage();
		},
	);
});

testWithBackend(
	'UAT-AUTH-003: User can hit resend after waiting time',
	{
		tag: ['@uat', '@authentication'],
	},
	async ({ page, lang, d1 }) => {
		const email = generateTimestampedEmail();

		// User goes to authentication page, fill form, and submit
		const pomAuthenticate = new PageAuthenticate({ page, lang });
		await pomAuthenticate.goto();
		await pomAuthenticate.fill(email);
		await pomAuthenticate.continue('signup');

		// User waits and hits resend
		await pomAuthenticate.resend('signup');

		// verify that two emails are sent
		const [{ numMails }] = await d1
			.select({ numMails: count() })
			.from(schema.mails)
			.where(eq(schema.mails.to, email));
		expect(numMails).toBe(2);
	},
);

testWithBackend.describe(() => {
	const test = testWithBackend.extend<{ email: string }>({
		email: async ({ page, lang, d1 }, use) => {
			const email = generateTimestampedEmail();
			const [employer] = await d1
				.insert(schema.employers)
				.values({
					email,
					emailVerified: true,
					name: 'Company ABC',
					description: 'We are Company ABC, we do XYZ things.',
					website: 'https://example.com',
					onboardedAt: new Date(),
					agreed: true,
				})
				.returning({ email: schema.employers.email });
			expect(employer).toBeTruthy();

			const pomAuthenticate = new PageAuthenticate({ page, lang });
			await pomAuthenticate.goto();
			await pomAuthenticate.fill(email);
			await pomAuthenticate.continue('login');

			await use(email);
		},
	});

	test(
		'UAT-AUTH-004: User can log in after being onboarded',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, d1, mails, email }) => {
			// User receives and finishes login via email
			const pomMail = new PageMail({ page, lang, mails, d1 });
			await pomMail.login(email);

			// User is redirected to posting page
			const pomPostings = new PagePostings({ page, lang });
			await pomPostings.waitForPage();
		},
	);

	test(
		'UAT-AUTH-005: User is redirected to auth page if email link is expired',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, d1, mails, email }) => {
			// wait for token to expire
			const vars = getWranglerVars();
			await page.waitForTimeout(vars.AUTHENTICATE_EMAIL_EXPIRATION_SECONDS * 1000);

			// User receives and click on email link
			const pomMail = new PageMail({ page, lang, mails, d1 });
			pomMail.login(email);

			// User is redirected to authenticate page with error message
			const pomAuthenticate = new PageAuthenticate({ page, lang });
			await pomAuthenticate.waitForPage();
			await pomAuthenticate.expectError('EXPIRED_TOKEN');
		},
	);

	// TODO: test navigate to welcome, onboard, etc. after logged in
});
