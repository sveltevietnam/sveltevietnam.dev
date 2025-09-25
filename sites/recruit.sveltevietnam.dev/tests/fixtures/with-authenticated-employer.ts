import { mergeTests } from '@playwright/test';
import { eq } from 'drizzle-orm';

import { PageAuthenticate } from '../poms/authenticate';
import { PageMail } from '../poms/mail';
import { PagePostingList } from '../poms/posting-list';

import { schema, testWithBackend } from './with-backend';
import { testWithCommon } from './with-common';
import { testWithFaker } from './with-faker';

export const testWithAuthenticatedEmployer = mergeTests(
	testWithCommon,
	testWithBackend,
	testWithFaker,
).extend<{
	employer: (typeof schema.employers)['$inferSelect'];
}>({
	employer: async ({ d1, testFaker: faker }, use) => {
		// create employer in DB
		const [employer] = await d1
			.insert(schema.employers)
			.values({
				email: faker.internet.email().toLowerCase(),
				emailVerified: true,
				name: faker.company.name(),
				description: faker.lorem.paragraphs(3),
				website: faker.internet.url(),
				onboardedAt: new Date(),
				agreed: true,
			})
			.onConflictDoNothing({ target: schema.employers.email })
			.returning();

		await use(employer);
		await d1.delete(schema.employers).where(eq(schema.employers.id, employer.id));
	},
	page: async ({ lang, page, employer, mails, d1 }, use) => {
		// log in as the employer
		const pomAuthenticate = new PageAuthenticate({ page, lang });
		await pomAuthenticate.goto();
		await pomAuthenticate.fill(employer.email);
		await pomAuthenticate.continue('login');
		const pomMail = new PageMail({ page, lang, mails, d1 });
		await pomMail.login(employer.email);
		const pomPostingList = new PagePostingList({ page, lang });
		await pomPostingList.waitForPage();
		await use(page);
		await pomAuthenticate.accountMenu.logout();
	},
});
