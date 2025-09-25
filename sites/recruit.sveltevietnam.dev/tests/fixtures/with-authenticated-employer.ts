import { mergeTests, type Page } from '@playwright/test';
import type { Language } from '@sveltevietnam/i18n';
import { eq } from 'drizzle-orm';

import { PagePostingList } from '../poms/posting-list';

import { schema, testWithBackend, type D1, type Mails } from './with-backend';
import { testWithCommon } from './with-common';
import { testWithFaker } from './with-faker';

export async function login(settings: {
	email: string;
	lang: Language;
	page: Page;
	d1: D1;
	mails: Mails;
}): Promise<import('../poms/posting-list').PagePostingList> {
	const { email, page, lang, mails, d1 } = settings;

	// User goes to authenticate page, fill form, and submit
	const { PageAuthenticate } = await import('../poms/authenticate');
	const pomAuthenticate = new PageAuthenticate({ page, lang });
	await pomAuthenticate.goto();
	await pomAuthenticate.fill(email);
	await pomAuthenticate.continue('login');

	const { PageMail } = await import('../poms/mail');
	const pomMail = new PageMail({ page, lang, mails, d1 });
	await pomMail.login(email);
	const pomPostingList = new PagePostingList({ page, lang });
	await pomPostingList.waitForPage();
	return pomPostingList;
}

export const testWithAuthenticatedEmployer = mergeTests(
	testWithCommon,
	testWithBackend,
	testWithFaker,
).extend<{
	employer: (typeof schema.employers)['$inferSelect'];
}>({
	employer: async ({ d1, testFaker: faker }, use) => {
		const data = {
			email: faker.internet.email().toLowerCase(),
			emailVerified: true,
			name: faker.company.name(),
			description: faker.lorem.paragraphs(3),
			website: faker.internet.url(),
			onboardedAt: new Date(),
			agreed: true,
		};
		// create employer in DB
		const [employer] = await d1
			.insert(schema.employers)
			.values(data)
			.onConflictDoUpdate({ target: schema.employers.email, set: data })
			.returning();

		await use(employer);
		await d1.delete(schema.employers).where(eq(schema.employers.id, employer.id));
	},
	page: async ({ lang, page, employer, mails, d1 }, use) => {
		// log in as the employer
		const pomPostingList = await login({ email: employer.email, lang, page, mails, d1 });
		await use(page);
		await pomPostingList.accountMenu.logout();
	},
});
