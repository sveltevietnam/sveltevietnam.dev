import type { Faker } from '@faker-js/faker';
// import { expect } from '@playwright/test';
import { eq } from 'drizzle-orm';

import {
	JOB_POSTING_APPLICATION_METHODS,
	JOB_POSTING_TYPES,
} from '../src/lib/forms/job-posting-upsert/schema';

import { testWithBackend, schema } from './fixtures/with-backend';
import { PageAuthenticate } from './poms/authenticate';
import { PageMail } from './poms/mail';
import { PagePostingList } from './poms/posting-list';

testWithBackend.use({ lang: 'vi' });

function createJobPosting(options: {
	faker: Faker;
	employer: { email: string; id: string };
	status: 'pending' | 'active' | 'expired' | 'deleted';
}): (typeof schema.jobPostings)['$inferSelect'] {
	const { faker, employer, status } = options;

	const applicationMethod = faker.helpers.arrayElement(JOB_POSTING_APPLICATION_METHODS);
	const applicationLink = applicationMethod === 'email' ? employer.email : faker.internet.url();
	const posting: (typeof schema.jobPostings)['$inferSelect'] = {
		id: 'job_' + faker.string.nanoid(),
		employerId: employer.id,
		title: faker.person.jobTitle(),
		description: faker.lorem.paragraphs(3),
		location: `${faker.location.city()}, ${faker.location.country()}`,
		applicationMethod,
		applicationLink,
		salary: `${faker.number.int({ min: 500, max: 2000 })} USD / tháng`,
		type: faker.helpers.arrayElement(JOB_POSTING_TYPES),
		expiredAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
		createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
		updatedAt: null,
		approvedAt: null,
		deletedAt: null,
	};

	if (status === 'active') {
		posting.approvedAt = new Date();
	} else if (status === 'expired') {
		posting.expiredAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
		posting.createdAt = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
	} else if (status === 'deleted') {
		posting.deletedAt = new Date();
	}

	return posting;
}

const test = testWithBackend.extend<
	// eslint-disable-next-line @typescript-eslint/no-empty-object-type
	{},
	{
		employer: (typeof schema.employers)['$inferSelect'];
	}
>({
	employer: [
		async ({ d1, faker }, use) => {
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
		},
		{ scope: 'worker' },
	],
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
		await pomPostingList.accountMenu.logout();
	},
});

test('UAT-POST-001: User sees listing grouped by status', async ({
	page,
	lang,
	d1,
	faker,
	employer,
}) => {
	const postings = await d1
		.insert(schema.jobPostings)
		.values([
			createJobPosting({ faker, employer, status: 'pending' }),
			createJobPosting({ faker, employer, status: 'active' }),
			createJobPosting({ faker, employer, status: 'expired' }),
			createJobPosting({ faker, employer, status: 'deleted' }),
		])
		.onConflictDoNothing({ target: schema.jobPostings.id })
		.returning();
	await page.reload();

	const pomPostingList = new PagePostingList({ page, lang });
	await pomPostingList.match({
		active: `${lang}-posting-listing-active.yaml`,
		pending: `${lang}-posting-listing-pending.yaml`,
		expired: `${lang}-posting-listing-expired.yaml`,
	});

	await d1.batch([
		d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[0].id)),
		d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[1].id)),
		d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[2].id)),
	]);
	await page.reload();
	await pomPostingList.match({
		active: `${lang}-posting-listing-active.empty.yaml`,
	});
});
