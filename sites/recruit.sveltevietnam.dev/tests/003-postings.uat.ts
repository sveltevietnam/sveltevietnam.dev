import type { Faker } from '@faker-js/faker';
import { expect } from '@playwright/test';
import type { JobPostingStatus } from '@sveltevietnam/backend/data/job-postings/enums';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
import { eq } from 'drizzle-orm';
import sanitizeHtml from 'sanitize-html';

import * as m from '../src/data/locales/generated/messages';
import {
	JOB_POSTING_APPLICATION_METHODS,
	JOB_POSTING_TYPES,
} from '../src/lib/forms/job-posting-upsert/schema';

import { testWithAuthenticatedEmployer } from './fixtures/with-authenticated-employer';
import { schema, type D1 } from './fixtures/with-backend';
import { PageMail } from './poms/mail';
import { PagePostingDetails } from './poms/posting-details';
import { PagePostingEdit } from './poms/posting-edit';
import { PagePostingList } from './poms/posting-list';

// Setup test
testWithAuthenticatedEmployer.use({ lang: 'vi' });

function createJobPosting(options: {
	faker: Faker;
	employer: { email: string; id: string };
	status: JobPostingStatus;
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

function updateJobPostingStatus(
	d1: D1,
	id: string,
	status: JobPostingStatus | 'pending-and-expired',
) {
	const fields: Partial<(typeof schema.jobPostings)['$inferInsert']> = {};
	if (status === 'active') {
		fields.approvedAt = new Date();
		fields.deletedAt = null;
		fields.expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
	} else if (status === 'expired') {
		fields.expiredAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
		fields.approvedAt = new Date(Date.now() - 40 * 24 * 60 * 60 * 1000); // 40 days ago
		fields.deletedAt = null;
	} else if (status === 'deleted') {
		fields.deletedAt = new Date();
	} else if (status === 'pending-and-expired') {
		fields.approvedAt = null;
		fields.deletedAt = null;
		fields.expiredAt = new Date(Date.now() - 24 * 60 * 60 * 1000); // 1 day ago
	} else {
		fields.approvedAt = null;
		fields.deletedAt = null;
		fields.expiredAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
	}
	return d1.transaction(
		(tx) => tx.update(schema.jobPostings).set(fields).where(eq(schema.jobPostings.id, id)),
		{ behavior: 'immediate' },
	);
}

testWithAuthenticatedEmployer(
	'UAT-POST-001: User sees listing grouped by status',
	{ tag: ['@uat', '@postings'] },
	async ({ page, lang, d1, testFaker: faker, employer }) => {
		const postings = [
			createJobPosting({ faker, employer, status: 'pending' }),
			createJobPosting({ faker, employer, status: 'active' }),
			createJobPosting({ faker, employer, status: 'expired' }),
			createJobPosting({ faker, employer, status: 'deleted' }),
		];
		await d1.transaction(
			(tx) =>
				tx
					.insert(schema.jobPostings)
					.values(postings)
					.onConflictDoNothing({ target: schema.jobPostings.id }),
			{ behavior: 'immediate' },
		);
		await page.reload();

		const pomPostingList = new PagePostingList({ page, lang });
		await pomPostingList.match({
			active: `${lang}-active.yaml`,
			pending: `${lang}-pending.yaml`,
			expired: `${lang}-expired.yaml`,
		});

		await d1.transaction(
			async (tx) => {
				await tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[0].id));
				await tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[1].id));
				await tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[2].id));
				await tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, postings[3].id));
			},
			{ behavior: 'immediate' },
		);
		await page.reload();
		await pomPostingList.match({
			active: `${lang}-active.empty.yaml`,
		});
	},
);

testWithAuthenticatedEmployer(
	'UAT-POST-002: User can create posting',
	{ tag: ['@uat', '@postings'] },
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
		const dbPosting = await d1.transaction((tx) =>
			tx.query.jobPostings.findFirst({
				where: (table, { eq }) => eq(table.id, posting.id),
			}),
		);
		expect({
			...dbPosting,
			description: sanitizeHtml(dbPosting?.description ?? '', {
				allowedTags: [],
				allowedAttributes: {},
			}),
		}).toMatchObject({
			id: posting.id,
			employerId: employer.id,
			title: posting.title,
			description: posting.description.replace(/\n/g, ''),
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
		await expect(pomPostingDetails.callout.pending).toBeVisible();

		// User sees "Edit" and "Delete" actions enabled
		await Promise.all([
			expect(pomPostingDetails.actions.edit).toBeVisible(),
			expect(pomPostingDetails.actions.edit).not.toBeDisabled(),
			expect(pomPostingDetails.actions.delete).toBeVisible(),
			expect(pomPostingDetails.actions.delete).not.toBeDisabled(),
		]);

		// User gets back to listing page and sees the new posting in "Pending" section
		pomPostingList = await pomPostingDetails.backToListing();
		await pomPostingList.match({
			pending: `${lang}-listing.yaml`,
		});

		// Cleanup
		await d1.transaction(
			(tx) => tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, posting.id)),
			{ behavior: 'immediate' },
		);
	},
);

testWithAuthenticatedEmployer(
	'UAT-POST-003: User has to pass all validation for creation',
	{ tag: ['@uat', '@postings'] },
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
			await d1.transaction(
				(tx) =>
					tx
						.insert(schema.jobPostings)
						.values(posting)
						.onConflictDoNothing({ target: schema.jobPostings.id }),
				{ behavior: 'immediate' },
			);
			await page.reload();

			// User clicks on a posting in the list and is redirected to posting details page
			const pomPostingList = new PagePostingList({ page, lang });
			await pomPostingList.goToDetailPage(posting);

			await use(posting);

			await d1.transaction(
				(tx) => tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, posting.id)),
				{ behavior: 'immediate' },
			);
		},
	});

	testWithPosting(
		'UAT-POST-004: User can see share actions only if posting is approved and not deleted',
		{ tag: ['@uat', '@postings'] },
		async ({ page, lang, posting, d1 }) => {
			const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });

			// User does not see share actions (posting is not public yet)
			await Promise.all([
				expect(pomPostingDetails.actions.copyLink).toBeHidden(),
				expect(pomPostingDetails.actions.generateQR).toBeHidden(),
			]);

			// Mock approval of the posting
			await updateJobPostingStatus(d1, posting.id, 'active');

			// User reloads the page and now sees share actions
			await page.reload();
			await Promise.all([
				expect(pomPostingDetails.actions.copyLink).toBeVisible(),
				expect(pomPostingDetails.actions.generateQR).toBeVisible(),
			]);

			// Mock expiration of the posting
			await updateJobPostingStatus(d1, posting.id, 'expired');

			// User reloads the page and still sees share actions
			await page.reload();
			await Promise.all([
				expect(pomPostingDetails.actions.copyLink).toBeVisible(),
				expect(pomPostingDetails.actions.generateQR).toBeVisible(),
			]);

			// Mock deletion of the posting
			await updateJobPostingStatus(d1, posting.id, 'deleted');

			// User reloads the page and no longer sees share actions
			await page.reload();
			await Promise.all([
				expect(pomPostingDetails.actions.copyLink).toBeHidden(),
				expect(pomPostingDetails.actions.generateQR).toBeHidden(),
			]);
		},
	);

	testWithPosting(
		'UAT-POST-005: User can copy link to posting public page',
		{ tag: ['@uat', '@postings'] },
		async ({ page, lang, posting, d1 }) => {
			const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });

			// Mock approval of the posting
			await updateJobPostingStatus(d1, posting.id, 'active');

			// User can click "Copy Link" action and has the correct link copied to clipboard
			await page.reload();
			await pomPostingDetails.copyLink();
		},
	);

	testWithPosting(
		'UAT-POST-006: User can generate QR to posting public page',
		{ tag: ['@uat', '@postings'] },
		async ({ page, lang, posting, d1 }) => {
			const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });

			// Mock approval of the posting
			await updateJobPostingStatus(d1, posting.id, 'active');

			// User can click "Copy Link" action and has the correct link copied to clipboard
			await page.reload();
			await pomPostingDetails.generateQR();
		},
	);

	testWithPosting(
		'UAT-POST-007: User can edit posting',
		{ tag: ['@uat', '@postings'] },
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

	testWithPosting(
		'UAT-POST-008: User can delete posting',
		{ tag: ['@uat', '@postings'] },
		async ({ page, lang, posting }) => {
			// User clicks "Delete", confirms in dialog, and sees success alert
			const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });
			await pomPostingDetails.delete();

			// TODO: verify callout is displayed correctly

			// User gets back to listing page and no longer sees the deleted posting
			const pomPostingList = await pomPostingDetails.backToListing();
			await pomPostingList.match(null);
		},
	);
});

testWithAuthenticatedEmployer(
	'UAT-POST-009: User cannot edit expired or active posting',
	{ tag: ['@uat', '@postings'] },
	async ({ page, lang, d1, testFaker: faker, employer }) => {
		// Mock posting to be active (approved)
		const posting = createJobPosting({ faker, employer, status: 'active' });
		await d1.transaction(
			(tx) =>
				tx
					.insert(schema.jobPostings)
					.values(posting)
					.onConflictDoNothing({ target: schema.jobPostings.id }),
			{ behavior: 'immediate' },
		);
		await page.reload();

		// User clicks on a posting in the list and is redirected to posting details page
		const pomPostingList = new PagePostingList({ page, lang });
		await pomPostingList.goToDetailPage(posting);

		// User does not see "Edit" action
		const pomPostingDetails = new PagePostingDetails({ page, lang, id: posting.id });
		await expect(pomPostingDetails.actions.edit).toBeHidden();

		// User tries to go to edit page directly, but is redirected back to details page automatically
		const pomPostingEdit = new PagePostingEdit({ page, lang, id: posting.id });
		await pomPostingEdit.goto();
		await pomPostingDetails.waitForPage();

		// Mock so that posting is expired
		await updateJobPostingStatus(d1, posting.id, 'expired');

		// User still cannot see edit in details page or navigate to edit page if posting is expired
		await page.reload();
		await expect(pomPostingDetails.actions.edit).toBeHidden();
		await pomPostingEdit.goto();
		await pomPostingDetails.waitForPage();

		// Mock posting has never been approved, but is already expired
		await updateJobPostingStatus(d1, posting.id, 'pending-and-expired');

		// User still cannot see edit in details page or navigate to edit page
		// if posting is expired but never approved (still pending)
		await page.reload();
		await expect(pomPostingDetails.actions.edit).toBeHidden();
		await pomPostingEdit.goto();
		await pomPostingDetails.waitForPage();

		// Cleanup
		await d1.transaction(
			(tx) => tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, posting.id)),
			{ behavior: 'immediate' },
		);
	},
);

testWithAuthenticatedEmployer(
	'UAT-POST-010: Admin can approve via email notification',
	{ tag: ['@uat', '@postings'] },
	async ({ page, lang, d1, testFaker: faker, employer, mails }) => {
		const posting = createJobPosting({ faker, employer, status: 'pending' });

		// Employer can create job posting, following steps as in UAT-POST-002
		const pomPostingList = new PagePostingList({ page, lang });
		const pomPostingCreate = await pomPostingList.create();
		await pomPostingCreate.fill(posting);
		const pomPostinDetails = await pomPostingCreate.submit(posting.id);

		// Admin receives email notification and approve the posting
		const pomMail = new PageMail({ page, lang, mails, d1 });
		await pomMail.approveJobPostingAsAdmin();

		// Verify database is synced
		const record = await d1.transaction((tx) =>
			tx.query.jobPostings.findFirst({
				columns: { approvedAt: true },
				where: (table, { eq }) => eq(table.id, posting.id),
			}),
		);
		expect(record?.approvedAt).toBeTruthy();

		// Go back to recruit site to continue flow in after hooks
		await pomPostinDetails.goto();

		// Cleanup
		await d1.transaction(
			(tx) => tx.delete(schema.jobPostings).where(eq(schema.jobPostings.id, posting.id)),
			{ behavior: 'immediate' },
		);
	},
);
