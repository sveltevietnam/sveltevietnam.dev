import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from '@playwright/test';
import { count, eq } from 'drizzle-orm';

import { testWithBackend, schema } from './fixtures/test-with-backend';
import { PageAuthenticate } from './poms/authenticate';
import { PageMail } from './poms/mail';
import { PageOnboarding } from './poms/onboarding';
import { PagePostings } from './poms/postings';
import { generateTimestampedEmail } from './utils';

const lang = 'vi';
const __dirname = path.dirname(fileURLToPath(import.meta.url));

testWithBackend.describe(() => {
	const test = testWithBackend.extend<{ email: string }>({
		// eslint-disable-next-line no-empty-pattern
		email: async ({}, use) => {
			await use(generateTimestampedEmail());
		},
	});

	test.beforeEach(async ({ page, mails, d1, email }) => {
		// 1. User goes to authentication page, fill form, and submit
		const pomAuthenticate = new PageAuthenticate({ page, lang });
		await pomAuthenticate.goto();
		await pomAuthenticate.fill(email);
		await pomAuthenticate.continue('signup');

		// 2. User receives and get to onboarding page via email
		const pomMail = new PageMail({ page, lang, mails, d1 });
		await pomMail.onboard(email);

		// 3. User is redirected to onboarding page
		const pomOnboarding = new PageOnboarding({ page, lang });
		await pomOnboarding.waitForPage();
		await expect(pomOnboarding.accountMenu.locator).toBeHidden();
	});

	test(
		'UAT-001: User can sign up and be onboarded',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, d1, email }) => {
			const pomOnboarding = new PageOnboarding({ page, lang });

			// 1. User fills and submits onboarding form, and is redirected to welcome page
			const profileData = {
				name: 'Company ABC',
				description: 'We are Company ABC, we do XYZ things.',
				image: path.join(__dirname, './assets/images/image-500x500.jpeg'),
				website: 'https://example.com',
			};
			await pomOnboarding.fill(profileData);
			const pomWelcome = await pomOnboarding.submitForReview();

			// 2. User goes to profile page and verify their data
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
		'UAT-002: User can log out during onboarding and sign up again',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, mails, d1, email }) => {
			// 1. User logs out during onboarding and is redirected to authenticate page
			const pomOnboarding = new PageOnboarding({ page, lang });
			const pomAuthenticate = await pomOnboarding.useAnotherAccount();

			// 2. User signs up again
			await pomAuthenticate.fill(email);
			await pomAuthenticate.continue('signup');

			// 3. User receives and opens email
			const pomMail = new PageMail({ page, lang, mails, d1 });
			await pomMail.onboard(email);

			// 4. User is redirected to onboarding page
			await pomOnboarding.waitForPage();
		},
	);
});

testWithBackend(
	'UAT-003: User can hit resend after waiting time',
	{
		tag: ['@uat', '@authentication'],
	},
	async ({ page, d1 }) => {
		const email = generateTimestampedEmail();

		// 1. User goes to authentication page, fill form, and submit
		const pomAuthenticate = new PageAuthenticate({ page, lang });
		await pomAuthenticate.goto();
		await pomAuthenticate.fill(email);
		await pomAuthenticate.continue('signup');

		// 2. User waits and hits resend
		await pomAuthenticate.resend('signup');

		// verify that two emails are sent
		const [{ numMails }] = await d1
			.select({ numMails: count() })
			.from(schema.mails)
			.where(eq(schema.mails.to, email));
		expect(numMails).toBe(2);
	},
);

testWithBackend(
	'UAT-004: User can log in after being onboarded',
	{
		tag: ['@uat', '@authentication'],
	},
	async ({ page, d1, mails }) => {
		const [employer] = await d1
			.insert(schema.employers)
			.values({
				email: 'test+uat-002@example.com',
				emailVerified: true,
				name: 'Company ABC',
				description: 'We are Company ABC, we do XYZ things.',
				website: 'https://example.com',
				onboardedAt: new Date(),
				agreed: true,
			})
			.returning({ email: schema.employers.email });
		expect(employer).toBeTruthy();

		// 1. Go to authentication page, fill form, and submit
		const pomAuthenticate = new PageAuthenticate({ page, lang });
		await pomAuthenticate.goto();
		await pomAuthenticate.fill(employer.email);
		await pomAuthenticate.continue('login');

		// 2. User receives and finishes login via email
		const pomMail = new PageMail({ page, lang, mails, d1 });
		await pomMail.login(employer.email);

		// 3. User is redirected to posting page
		const pomPostings = new PagePostings({ page, lang });
		await pomPostings.waitForPage();
	},
);
