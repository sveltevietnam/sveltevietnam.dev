import type { Faker } from '@faker-js/faker';
import { mergeTests, type Page } from '@playwright/test';
import type { Language } from '@sveltevietnam/kit/constants';
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

export function generateEmployerTestData(faker: Faker): (typeof schema.employers)['$inferSelect'] {
	return {
		id: 'employer_' + faker.string.nanoid(),
		email: faker.internet.email().toLowerCase(),
		image: faker.image.url(),
		emailVerified: true,
		name: faker.company.name(),
		description: faker.lorem.paragraphs(3),
		website: faker.internet.url(),
		onboardedAt: new Date(),
		agreed: true,
		createdAt: new Date(),
		updatedAt: null,
	};
}

export const testWithAuthenticatedEmployer = mergeTests(
	testWithCommon,
	testWithBackend,
	testWithFaker,
).extend<{
	employer: (typeof schema.employers)['$inferSelect'];
}>({
	employer: async ({ testFaker: faker }, use) => {
		await use(generateEmployerTestData(faker));
	},
	page: async ({ browser, lang, employer, mails, d1 }, use) => {
		// create employer in DB
		await d1.transaction(
			(tx) =>
				tx
					.insert(schema.employers)
					.values(employer)
					.onConflictDoUpdate({ target: schema.employers.email, set: employer })
					.returning(),
			{ behavior: 'immediate' },
		);

		const context = await browser.newContext();
		const page = await context.newPage();
		const pomPostingList = await login({ email: employer.email, lang, page, mails, d1 });

		await use(page);

		if (new URL(page.url()).origin !== process.env.VITE_PUBLIC_MODE) {
			await pomPostingList.goto();
		}
		await pomPostingList.accountMenu.logout();
		await context.close();
		await d1.transaction(
			(tx) => tx.delete(schema.employers).where(eq(schema.employers.id, employer.id)),
			{ behavior: 'immediate' },
		);
	},
});
