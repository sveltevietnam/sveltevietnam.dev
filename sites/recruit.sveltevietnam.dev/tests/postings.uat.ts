import type { Faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
import { eq } from 'drizzle-orm';

import * as m from '../src/data/locales/generated/messages';
import {
	JOB_POSTING_APPLICATION_METHODS,
	JOB_POSTING_TYPES,
} from '../src/lib/forms/job-posting-upsert/schema';

import { testWithAuthenticatedEmployer } from './fixtures/with-authenticated-employer';
import { schema } from './fixtures/with-backend';
import { PagePostingDetails } from './poms/posting-details';
import { PagePostingList } from './poms/posting-list';

// Setup test
testWithAuthenticatedEmployer.use({ lang: 'vi' });

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

testWithAuthenticatedEmployer(
	'UAT-POST-001: User sees listing grouped by status',
	async ({ page, lang, d1, testFaker: faker, employer }) => {
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
			d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[3].id)),
		]);
		await page.reload();
		await pomPostingList.match({
			active: `${lang}-active.empty.yaml`,
		});
	},
);

testWithAuthenticatedEmployer(
	'UAT-POST-002: User can create posting',
	async ({ page, lang, d1, testFaker: faker, employer }) => {
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

		// Cleanup
		await d1.delete(schema.jobPostings).where(eq(schema.jobPostings.id, posting.id));
	},
);

testWithAuthenticatedEmployer(
	'UAT-POST-003: User has to pass all input validation during posting creation',
	async ({ page, lang }) => {
		// User clicks "Create Posting" button and is redirected to posting creation page
		const pomPostingList = new PagePostingList({ page, lang });
		const pomPostingCreate = await pomPostingList.create();

		// Programatically force all inputs to be non-required
		await Promise.all([
			pomPostingCreate.form.inputs.title.input.evaluate((el) => el.removeAttribute('required')),
			pomPostingCreate.form.inputs.type.input.evaluate((el) => {
				el.removeAttribute('required');
				(el as HTMLSelectElement).selectedIndex = -1;
			}),
			pomPostingCreate.form.inputs.location.input.evaluate((el) => el.removeAttribute('required')),
			pomPostingCreate.form.inputs.salary.input.evaluate((el) => el.removeAttribute('required')),
			pomPostingCreate.form.inputs.applicationMethod.input.evaluate((el) => {
				el.removeAttribute('required');
				(el as HTMLSelectElement).selectedIndex = -1;
			}),
			pomPostingCreate.form.inputs.applicationLink.input.evaluate((el) => {
				el.removeAttribute('required');
				el.setAttribute('type', 'text');
			}),
			pomPostingCreate.form.inputs.expiredAt.input.evaluate((el) => {
				el.removeAttribute('required');
				el.removeAttribute('max');
				el.removeAttribute('min');
			}),
			pomPostingCreate.form.inputs.description.input.evaluate((el) =>
				el.removeAttribute('required'),
			),
		]);

		// User tries to submit empty form & see errors for all required fields
		await pomPostingCreate.form.submit.click();
		await Promise.all([
			expect(pomPostingCreate.form.inputs.title.error).toHaveText(
				m['inputs.job_posting.title.errors.nonempty'](lang).toString(),
			),
			expect(pomPostingCreate.form.inputs.location.error).toHaveText(
				m['inputs.job_posting.location.errors.nonempty'](lang).toString(),
			),
			expect(pomPostingCreate.form.inputs.salary.error).toHaveText(
				m['inputs.job_posting.salary.errors.nonempty'](lang).toString(),
			),
			expect(pomPostingCreate.form.inputs.expiredAt.error).toHaveText(
				m['inputs.job_posting.expired_at.errors.nonempty'](lang).toString(),
			),
			expect(pomPostingCreate.form.inputs.description.error).toHaveText(
				m['inputs.job_posting.desc.errors.nonempty'](lang).toString(),
			),
		]);

		// User tries invalid application email
		await pomPostingCreate.form.inputs.applicationMethod.input.selectOption({ value: 'email' });
		await pomPostingCreate.form.inputs.applicationLink.input.fill('invalid-email');
		await pomPostingCreate.form.inputs.applicationLink.input.evaluate((el) => {
			el.removeAttribute('required');
			el.setAttribute('type', 'text');
		});
		await pomPostingCreate.form.submit.click();
		await expect(pomPostingCreate.form.inputs.applicationLink.error).toHaveText(
			m['inputs.email.errors.invalid'](lang).toString(),
		);

		// User tries invalid application url
		await pomPostingCreate.form.inputs.applicationMethod.input.selectOption({ value: 'url' });
		await pomPostingCreate.form.inputs.applicationLink.input.fill('invalid-url');
		await pomPostingCreate.form.inputs.applicationLink.input.evaluate((el) => {
			el.removeAttribute('required');
			el.setAttribute('type', 'text');
		});
		await pomPostingCreate.form.submit.click();
		await expect(pomPostingCreate.form.inputs.applicationLink.error).toHaveText(
			m['inputs.url.errors.invalid'](lang).toString(),
		);

		// User tries past date for expiration
		const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
		await pomPostingCreate.form.inputs.expiredAt.input.fill(formatDate(pastDate, '-'));
		await pomPostingCreate.form.submit.click();
		await expect(pomPostingCreate.form.inputs.expiredAt.error).toHaveText(
			m['inputs.job_posting.expired_at.errors.min'](lang).toString(),
		);

		// User tries too far date for expiration
		const tooFarDate = new Date(Date.now() + 200 * 24 * 60 * 60 * 1000); // 200 days from now
		await pomPostingCreate.form.inputs.expiredAt.input.fill(formatDate(tooFarDate, '-'));
		await pomPostingCreate.form.submit.click();
		await expect(pomPostingCreate.form.inputs.expiredAt.error).toHaveText(
			m['inputs.job_posting.expired_at.errors.max'](lang).toString(),
		);
	},
);

testWithAuthenticatedEmployer.describe(() => {
	const testWithPosting = testWithAuthenticatedEmployer.extend<{
		posting: (typeof schema.jobPostings)['$inferSelect'];
	}>({
		posting: async ({ d1, testFaker: faker, lang, employer, page }, use) => {
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

	testWithPosting(
		'UAT-POST-004: User can edit posting',
		async ({ page, lang, testFaker: faker, employer, posting }) => {
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

	testWithPosting('UAT-POST-005: User can delete posting', async ({ page, lang, posting }) => {
		// User clicks "Delete", confirms in dialog, and sees success alert
		const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });
		await pomPostingDetails.delete();

		// User gets back to listing page and no longer sees the deleted posting
		const pomPostingList = await pomPostingDetails.backToListing();
		await pomPostingList.match(null);
	});
});
