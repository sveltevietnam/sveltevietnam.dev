import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect, mergeTests } from '@playwright/test';
import { count, eq } from 'drizzle-orm';

import * as m from '../src/data/locales/generated/messages';

import { generateEmployerTestData } from './fixtures/with-authenticated-employer';
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
				where: (table, { eq }) => eq(table.email, email.toLowerCase()),
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
		'UAT-AUTH-002: User has to pass all input validation during onboarding',
		{
			tag: ['@uat', '@authentication'],
		},
		async ({ page, lang, testFaker: faker }) => {
			const pomOnboarding = new PageOnboarding({ page, lang });

			// 1. Programatically make all inputs non-required,
			// so that we can trigger server validation
			await expect(pomOnboarding.inputs.agreement.input).toBeChecked({ checked: false });
			await Promise.all([
				pomOnboarding.inputs.name.input.evaluate((el) => el.removeAttribute('required')),
				pomOnboarding.inputs.website.input.evaluate((el) => {
					el.removeAttribute('required');
					el.setAttribute('type', 'text'); // make it text so that invalid url can be tested
				}),
				pomOnboarding.inputs.description.input.evaluate((el) => el.removeAttribute('required')),
				pomOnboarding.inputs.image.input.evaluate((el) => {
					el.removeAttribute('required');
					el.removeAttribute('accept'); // make it accept all files so that invalid file can be tested
				}),
				pomOnboarding.inputs.agreement.input.evaluate((el) => el.removeAttribute('required')),
			]);

			// 2. User tries to submit empty form
			await pomOnboarding.ctas.submitForReview.click();

			// 3. User sees validation errors for all required fields
			await Promise.all([
				expect(pomOnboarding.inputs.name.error).toHaveText(
					m['inputs.name.errors.nonempty'](lang).toString(),
				),
				expect(pomOnboarding.inputs.description.error).toHaveText(
					m['inputs.employer.desc.errors.nonempty'](lang).toString(),
				),
				expect(pomOnboarding.inputs.agreement.error).toHaveText(
					m['inputs.employer.agreement.error'](lang).toString(),
				),
			]);

			// 4. User tries invalid url for website
			await pomOnboarding.inputs.website.input.fill(faker.lorem.word());
			await pomOnboarding.ctas.submitForReview.click();
			await expect(pomOnboarding.inputs.website.error).toHaveText(
				m['inputs.url.errors.invalid'](lang).toString(),
			);

			// 5. User tries upload files that are not image
			let fileChooserPromise = pomOnboarding.page.waitForEvent('filechooser');
			await pomOnboarding.inputs.image.input.click();
			let fileChooser = await fileChooserPromise;
			await fileChooser.setFiles(path.join(__dirname, './assets/sample.txt'));
			await pomOnboarding.ctas.submitForReview.click();
			await Promise.all([
				expect(pomOnboarding.inputs.image.error).toHaveText(
					m['inputs.employer.image.errors.type'](lang).toString(),
				),
				expect(pomOnboarding.imagePreview).toBeHidden(),
			]);

			// 5. User tries upload image that is too large
			fileChooserPromise = pomOnboarding.page.waitForEvent('filechooser');
			await pomOnboarding.inputs.image.input.click();
			fileChooser = await fileChooserPromise;
			await fileChooser.setFiles(path.join(__dirname, './assets/images/image-over-1MB.jpeg'));
			await pomOnboarding.ctas.submitForReview.click();
			await Promise.all([
				expect(pomOnboarding.inputs.image.error).toHaveText(
					m['inputs.employer.image.errors.size'](lang).toString(),
				),
				expect(pomOnboarding.imagePreview).toBeHidden(),
			]);
		},
	);

	testWithEmail(
		'UAT-AUTH-003: User can log out during onboarding and sign up again',
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
	'UAT-AUTH-004: User can hit resend after waiting time',
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
			const data = generateEmployerTestData(workerFaker);
			const [employer] = await d1
				.insert(schema.employers)
				.values(data)
				.onConflictDoUpdate({ target: schema.employers.email, set: data })
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
		'UAT-AUTH-005: User can log in after being onboarded',
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
		'UAT-AUTH-006: User is redirected to auth page if email link is expired',
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
