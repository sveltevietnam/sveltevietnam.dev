import { expect, type Locator } from '@playwright/test';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';
import * as b from '../../src/data/routes/generated/breadcrumbs';
import { JOB_POSTING_TYPE_LABEL } from '../../src/lib/forms/job-posting-upsert/schema';
import { type schema } from '../fixtures/with-backend';

import { PagePostingList } from './posting-list';
import { CommonPageObjectModel, type CommonPageObjectModelInit } from './utils';

export interface PagePostingDetailsInit extends CommonPageObjectModelInit {
	id: string;
}

export class PagePostingDetails extends CommonPageObjectModel {
	public readonly path: string;
	public readonly id: string;

	public readonly employer: {
		name: Locator;
		image: Locator;
		description: Locator;
	};
	public readonly posting: {
		title: Locator;
		type: Locator;
		location: Locator;
		salary: Locator;
		postedAt: Locator;
		expiredAt: Locator;
		description: Locator;
	};
	public readonly actions: {
		apply: Locator;
		copyLink: Locator;
		generateQR: Locator;
		delete: Locator;
		edit: Locator;
	};
	public readonly pendingApprovalNote: Locator;

	constructor(init: PagePostingDetailsInit) {
		super(init);
		this.id = init.id;
		this.path = p['/:lang/postings/:id']({ lang: this.lang, id: this.id });

		this.employer = {
			name: this.page.getByTestId('employer-name'),
			image: this.page.getByTestId('employer-image'),
			description: this.page.getByTestId('employer-description'),
		};

		this.posting = {
			title: this.page.getByRole('heading', { level: 1 }),
			type: this.page.getByTestId('job-type'),
			location: this.page.getByTestId('job-location'),
			salary: this.page.getByTestId('job-salary'),
			postedAt: this.page.getByTestId('job-posted-at'),
			expiredAt: this.page.getByTestId('job-expired-at'),
			description: this.page.getByTestId('job-description'),
		};

		this.actions = {
			apply: this.page.getByRole('button', {
				name: m['pages.postings_id.actions.apply'](this.lang).toString(),
			}),
			copyLink: this.page.getByRole('button', {
				name: m['pages.postings_id.actions.share.link'](this.lang).toString(),
			}),
			generateQR: this.page.getByRole('button', {
				name: m['pages.postings_id.actions.share.qr'](this.lang).toString(),
			}),
			delete: this.page.getByRole('button', {
				name: m['pages.postings_id.manage.delete'](this.lang).toString(),
			}),
			edit: this.page.getByRole('link', {
				name: m['pages.postings_id.manage.edit'](this.lang).toString(),
			}),
		};

		this.pendingApprovalNote = this.page.getByRole('note').filter({
			hasText: m['pages.postings_id.pending'](this.lang).toString(),
		});
	}

	async match(data: {
		employer: (typeof schema.employers)['$inferSelect'];
		posting: (typeof schema.jobPostings)['$inferSelect'];
	}) {
		const { employer, posting } = data;
		await Promise.all([
			// employer
			employer.website
				? expect(this.employer.name.getByRole('link', { name: employer.name })).toHaveAttribute(
						'href',
						employer.website,
					)
				: expect(this.employer.name).toHaveText(employer.name),
			employer.image
				? expect(this.employer.image).toHaveAttribute('src', employer.image)
				: expect(this.employer.image).toBeHidden(),
			employer.description && expect(this.employer.description).toHaveText(/\w+/),

			// posting
			expect(this.posting.title).toHaveText(posting.title),
			expect(this.posting.type).toHaveText(
				JOB_POSTING_TYPE_LABEL[posting.type](this.lang).toString(),
			),
			expect(this.posting.location).toHaveText(posting.location),
			expect(this.posting.salary).toHaveText(posting.salary),
			posting.approvedAt
				? expect(this.posting.postedAt).toHaveText(
						`${m['pages.postings_id.general.posted_at'](this.lang).toString()} ${formatDate(posting.approvedAt)}`,
					)
				: expect(this.posting.postedAt).toBeHidden(),
			expect(this.posting.expiredAt).toHaveText(
				`${m['pages.postings_id.general.expired_at'](this.lang).toString()} ${formatDate(posting.expiredAt)}`,
			),
			posting.description && expect(this.posting.description).toHaveText(/\w+/),
		]);
	}

	async backToListing() {
		const breadcrumbs = this.page.getByRole('navigation', {
			name: m['components.breadcrumbs.aria'](this.lang).toString(),
		});
		await expect(breadcrumbs).toBeVisible();
		const link = breadcrumbs.getByRole('link', {
			name: b['/:lang/postings']({ lang: this.lang }).at(-1)?.name,
		});
		await expect(link).toBeVisible();
		link.click();
		const pagePostingList = new PagePostingList({ page: this.page, lang: this.lang });
		await pagePostingList.waitForPage();
		return pagePostingList;
	}
}
