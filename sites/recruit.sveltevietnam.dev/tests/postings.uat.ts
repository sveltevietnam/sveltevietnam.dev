import type { Faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
import { eq } from 'drizzle-orm';

import {
	JOB_POSTING_APPLICATION_METHODS,
	JOB_POSTING_TYPES,
} from '../src/lib/forms/job-posting-upsert/schema';

import { testWithBackend, schema } from './fixtures/with-backend';
import { PageAuthenticate } from './poms/authenticate';
import { PageMail } from './poms/mail';
import { PagePostingDetails } from './poms/posting-details';
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
		posting.approvedAt = new Date(); // today
	} else if (status === 'expired') {
		posting.expiredAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
		posting.createdAt = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
	} else if (status === 'deleted') {
		posting.deletedAt = new Date(); // today
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
		active: `${lang}-active.yaml`,
		pending: `${lang}-pending.yaml`,
		expired: `${lang}-expired.yaml`,
	});

	await d1.batch([
		d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[0].id)),
		d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[1].id)),
		d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[2].id)),
	]);
	await page.reload();
	await pomPostingList.match({
		active: `${lang}-active.empty.yaml`,
	});
});

test('UAT-POST-002: User can create posting', async ({ page, lang, d1, faker, employer }) => {
	const posting = createJobPosting({ faker, employer, status: 'pending' });

	// User clicks "Create Posting" button and is redirected to posting creation page
	let pomPostingList = new PagePostingList({ page, lang });
	const pomPostingCreate = await pomPostingList.create();

	// User fills out the form
	await pomPostingCreate.fill(posting);

	// User submits, is redirected to posting details page, and sees success alert
	const pomPostingDetails = await pomPostingCreate.submit(posting.id);

	// check data consistency
	const dbPosting = await d1.query.jobPostings.findFirst({
		where: (table, { eq }) => eq(table.id, posting.id),
	});
	expect(dbPosting).toMatchObject({
		id: posting.id,
		employerId: employer.id,
		title: posting.title,
		description: posting.description,
		location: posting.location,
		salary: posting.salary,
		type: posting.type,
		applicationMethod: posting.applicationMethod,
		applicationLink: posting.applicationLink,
		expiredAt: new Date(formatDate(posting.expiredAt, '-')),
		approvedAt: posting.approvedAt,
	});

	// User sees all info correctly displayed on posting details page
	await pomPostingDetails.match({ employer, posting });

	// User sees callout about posting pending approval
	await expect(pomPostingDetails.pendingApprovalNote).toBeVisible();

	// User sees "Edit" and "Delete" actions enabled
	await expect(pomPostingDetails.actions.edit).toBeVisible();
	await expect(pomPostingDetails.actions.edit).not.toBeDisabled();
	await expect(pomPostingDetails.actions.delete).toBeVisible();
	await expect(pomPostingDetails.actions.delete).not.toBeDisabled();

	// User gets back to listing page and sees the new posting in "Pending" section
	pomPostingList = await pomPostingDetails.backToListing();
	await pomPostingList.match({
		pending: `${lang}-listing.yaml`,
	});
});

test.describe(() => {
	const testWithExistingPosting = test.extend<{
		posting: (typeof schema.jobPostings)['$inferSelect'];
	}>({
		posting: async ({ d1, faker, lang, employer, page }, use) => {
			const posting = createJobPosting({ faker, employer, status: 'pending' });
			await d1.insert(schema.jobPostings).values(posting);
			await page.reload();

			// User clicks on a posting in the list and is redirected to posting details page
			const pomPostingList = new PagePostingList({ page, lang });
			await pomPostingList.goToDetailPage(posting);

			await use(posting);

			await d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, posting.id));
		},
	});

	testWithExistingPosting(
		'UAT-POST-003: User can edit posting',
		async ({ page, lang, faker, employer, posting }) => {
			// User clicks "Edit" and is redirected to posting edit page
			let pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });
			const pomPostingEdit = await pomPostingDetails.edit();

			// User updates some fields
			const editedPosting = createJobPosting({ faker, employer, status: 'pending' });
			await pomPostingEdit.fill(editedPosting);

			// User submits, is redirected to posting details page, and sees success alert
			pomPostingDetails = await pomPostingEdit.submit(posting.id);

			// User sees all updated info correctly displayed
			await pomPostingDetails.match({ employer, posting: editedPosting });
		},
	);

	testWithExistingPosting(
		'UAT-POST-004: User can delete posting',
		async ({ page, lang, posting }) => {
			// User clicks "Delete", confirms in dialog, and sees success alert
			const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });
			await pomPostingDetails.delete();

			// User gets back to listing page and no longer sees the deleted posting
			const pomPostingList = await pomPostingDetails.backToListing();
			await pomPostingList.match(null);
		},
	);
});
