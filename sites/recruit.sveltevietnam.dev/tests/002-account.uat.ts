import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { expect } from '@playwright/test';
import { eq } from 'drizzle-orm';

import * as m from '../src/lib/i18n/generated/messages';

import {
	generateEmployerTestData,
	testWithAuthenticatedEmployer,
} from './fixtures/with-authenticated-employer';
import { type D1, schema } from './fixtures/with-backend';
import { PageMail } from './poms/mail';
import { PageProfile } from './poms/profile';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Setup test
testWithAuthenticatedEmployer.use({ lang: 'vi' });

async function checkPostVerification(d1: D1, email: string, verified = false) {
	const employer = await d1.transaction((tx) =>
		tx.query.employers.findFirst({
			where: (table, { eq }) => eq(table.email, email.toLowerCase()),
		}),
	);
	expect(employer).toBeTruthy();
	expect(employer!.emailVerified).toBe(verified);
}

testWithAuthenticatedEmployer(
	'UAT-ACC-001: User can change email',
	{ tag: ['@uat', '@account'] },
	async ({ page, lang, employer, testFaker: faker, mails, d1 }) => {
		// User goes to profile page
		const pomProfile = new PageProfile({ page, lang });
		await pomProfile.accountMenu.goToProfile();

		const newEmail = faker.internet.email();

		// User fills in the form and submits
		await pomProfile.changeEmail(
			{ email: newEmail },
			{ type: 'success', message: m['pages.profile.update_email.callout.pending'] },
		);

		// User reloads page and do it again
		await page.reload();
		await pomProfile.changeEmail(
			{ email: newEmail },
			{ type: 'success', message: m['pages.profile.update_email.callout.pending'] },
		);

		// User verifies change via email and is redirected to email change verification page
		const pomMail = new PageMail({ page, lang, mails, d1 });
		const pomEmailChangeVerification = await pomMail.verifyEmailChange(employer.email);
		await pomEmailChangeVerification.match('ok');

		// verify data consistency
		await checkPostVerification(d1, newEmail, true);
	},
);

testWithAuthenticatedEmployer(
	"UAT-ACC-002: User cannot change email to existing ones (theirs or others')",
	{ tag: ['@uat', '@account'] },
	async ({ page, lang, employer, testFaker: faker, d1 }) => {
		// User goes to profile page
		const pomProfile = new PageProfile({ page, lang });
		await pomProfile.accountMenu.goToProfile();

		// User tries their own email
		await pomProfile.changeEmail(
			{ email: employer.email },
			{ type: 'error', message: m['inputs.email.errors.current'] },
		);

		// User tries someone else's email
		const anotherEmployer = generateEmployerTestData(faker);
		await d1.transaction(
			(tx) =>
				tx
					.insert(schema.employers)
					.values(anotherEmployer)
					.onConflictDoUpdate({ target: schema.employers.email, set: anotherEmployer }),
			{ behavior: 'immediate' },
		);
		await pomProfile.changeEmail(
			{ email: anotherEmployer.email },
			{ type: 'error', message: m['inputs.email.errors.existed'] },
		);

		await d1.transaction(
			(tx) => tx.delete(schema.employers).where(eq(schema.employers.id, anotherEmployer.id)),
			{ behavior: 'immediate' },
		);
	},
);

testWithAuthenticatedEmployer(
	'UAT-ACC-003: User can update profile information',
	{ tag: ['@uat', '@account'] },
	async ({ page, lang, testFaker: faker, employer, d1 }) => {
		// User goes to profile page
		const pomProfile = new PageProfile({ page, lang });
		await pomProfile.accountMenu.goToProfile();

		// User updates their profile information
		const newEmployerProfile = {
			...generateEmployerTestData(faker),
			image: path.join(__dirname, './assets/images/image-500x500.jpeg'),
		};
		await pomProfile.fillInfoForm(newEmployerProfile);

		// User submits the form and sees success alert
		await pomProfile.saveInfo(m['pages.profile.update_info.success']);

		// User reloads and verify
		await page.reload();
		const { image } =
			(await d1.transaction((tx) =>
				tx.query.employers.findFirst({
					columns: { image: true },
					where: (table, { eq }) => eq(table.email, employer.email),
				}),
			)) ?? {};
		expect(image).not.toBe(employer.image);
		await pomProfile.match({
			...newEmployerProfile,
			email: employer.email, // email doesn't change here
			image,
		});
	},
);
