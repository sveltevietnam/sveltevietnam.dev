import { expect } from '@playwright/test';

import * as m from '../src/data/locales/generated/messages';

import { login, testWithAuthenticatedEmployer } from './fixtures/with-authenticated-employer';
import type { D1 } from './fixtures/with-backend';
import { PageMail } from './poms/mail';
import { PageProfile } from './poms/profile';

// Setup test
testWithAuthenticatedEmployer.use({ lang: 'vi' });

async function checkPostVerification(d1: D1, email: string, verified = false) {
	const employer = await d1.query.employers.findFirst({
		where: (table, { eq }) => eq(table.email, email.toLowerCase()),
	});
	expect(employer).toBeTruthy();
	expect(employer!.emailVerified).toBe(verified);
}

testWithAuthenticatedEmployer(
	'UAT-PRO-001: User can change email',
	async ({ page, lang, employer, testFaker: faker, mails, d1 }) => {
		// User goes to profile page
		const pomProfile = new PageProfile({ page, lang });
		await pomProfile.accountMenu.goToProfile();

		const newEmail = faker.internet.email();

		// User fills in the form and submits
		await pomProfile.changeEmail(
			{ email: newEmail },
			m['pages.profile.update_email.callout.pending'],
		);

		// User reloads page and do it again
		await page.reload();
		await pomProfile.changeEmail(
			{ email: newEmail },
			m['pages.profile.update_email.callout.pending'],
		);

		// User verifies change via email and is redirected to email change verification page
		const pomMail = new PageMail({ page, lang, mails, d1 });
		const pomEmailChangeVerification = await pomMail.verifyEmailChange(employer.email);
		await pomEmailChangeVerification.match('ok');

		// verify data consistency
		await checkPostVerification(d1, newEmail, false);
	},
);

testWithAuthenticatedEmployer(
	'UAT-PRO-002: User can only change email again after re-login',
	async ({ page, lang, employer, testFaker: faker, mails, d1 }) => {
		const newEmail = faker.internet.email();

		// User goes to profile page
		let pomProfile = new PageProfile({ page, lang });
		await pomProfile.accountMenu.goToProfile();

		// User fills in the form and submits
		await pomProfile.changeEmail(
			{ email: newEmail },
			m['pages.profile.update_email.callout.pending'],
		);

		// User verifies change via email and is redirected to email change verification page
		const pomMail = new PageMail({ page, lang, mails, d1 });
		const pomEmailChangeVerification = await pomMail.verifyEmailChange(employer.email);
		await pomEmailChangeVerification.match('ok');

		// verify data consistency
		await checkPostVerification(d1, newEmail, false);

		// User goes to profile page and try changing email again
		const anotherEmail = faker.internet.email();
		await pomEmailChangeVerification.accountMenu.goToProfile();
		await page.reload();
		await pomProfile.changeEmail(
			{ email: anotherEmail },
			m['pages.profile.update_email.callout.unverified'],
		);

		// User logs out and logs in again
		await pomProfile.accountMenu.logout();
		const pomPostingList = await login({ email: newEmail, lang, page, mails, d1 });

		// verify email is now verified in db
		const updatedEmployer = await d1.query.employers.findFirst({
			columns: { emailVerified: true },
			where: (table, { eq }) => eq(table.email, newEmail.toLowerCase()),
		});
		expect(updatedEmployer!.emailVerified).toBeTruthy();

		// User goes to profile page and can now request change again
		pomProfile = await pomPostingList.accountMenu.goToProfile();
		await pomProfile.changeEmail(
			{ email: anotherEmail },
			m['pages.profile.update_email.callout.pending'],
		);
	},
);
