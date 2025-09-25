import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, mergeTests } from '@playwright/test';
import { count, eq } from 'drizzle-orm';

import { testWithBackend, schema } from './fixtures/with-backend';
import { testWithCommon } from './fixtures/with-common';
import { testWithFaker } from './fixtures/with-faker';
import { PageAuthenticate } from './poms/authenticate';
import { PageMail } from './poms/mail';
import { PageOnboarding } from './poms/onboarding';
import { PagePostingList } from './poms/posting-list';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup test
const test = mergeTests(testWithCommon, testWithBackend, testWithFaker);
test.use({ lang: 'vi' });

test.describe(() => {
	const testWithEmail = test.extend<{ email: string }>({
		email: async ({ page, lang, mails, d1, workerFaker }, use) => {
			const email = workerFaker.internet.email().toLowerCase();
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

			await d1.delete(schema.employers).where(eq(schema.employers.email, email));
		},
	});

	testWithEmail(
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
			await pomProfile.match({
				...profileData,
				email,
				image: employer!.image,
			});

			// 3. User logs out
			await pomProfile.accountMenu.logout();
		},
	);

	testWithEmail(
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

test(
	'UAT-AUTH-003: User can hit resend after waiting time',
	{
		tag: ['@uat', '@authentication'],
	},
	async ({ page, lang, d1, workerFaker }) => {
		const email = workerFaker.internet.email().toLowerCase();

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

test.describe(() => {
	const testWithEmail = test.extend<{ email: string }>({
		email: async ({ page, lang, d1, workerFaker }, use) => {
			const [employer] = await d1
				.insert(schema.employers)
				.values({
					email: workerFaker.internet.email().toLowerCase(),
					emailVerified: true,
					name: workerFaker.company.name(),
					description: workerFaker.lorem.paragraphs(3),
					website: workerFaker.internet.url(),
					onboardedAt: new Date(),
					agreed: true,
				})
				.returning();
			expect(employer).toBeTruthy();

			const pomAuthenticate = new PageAuthenticate({ page, lang });
			await pomAuthenticate.goto();
			await pomAuthenticate.fill(employer.email);
			await pomAuthenticate.continue('login');

			await use(employer.email);

			await d1.delete(schema.employers).where(eq(schema.employers.id, employer.id));
		},
	});

	testWithEmail(
		'UAT-AUTH-004: User can log in after being onboarded',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, d1, mails, email }) => {
			// User receives and finishes login via email
			const pomMail = new PageMail({ page, lang, mails, d1 });
			await pomMail.login(email);

			// User is redirected to posting page
			const pomPostings = new PagePostingList({ page, lang });
			await pomPostings.waitForPage();
		},
	);

	testWithEmail(
		'UAT-AUTH-005: User is redirected to auth page if email link is expired',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, d1, mails, email, vars }) => {
			// wait for token to expire
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
