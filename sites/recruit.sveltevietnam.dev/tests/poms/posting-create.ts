import { expect, type Locator } from '@playwright/test';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';
import { schema } from '../fixtures/with-backend';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export class PagePostingCreate extends CommonPageObjectModel {
	public readonly path: string;
	public readonly form: {
		inputs: {
			id: Locator;
			title: Locator;
			type: Locator;
			location: Locator;
			salary: Locator;
			applicationMethod: Locator;
			applicationLink: Locator;
			expiredAt: Locator;
			description: Locator;
		};
		submit: Locator;
	};
	public readonly successMessage = m['pages.postings_upsert.notifications.create'];

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/postings/create']({ lang: this.lang });

		const applicationMethod = this.page.getByRole('combobox', {
			name: m['inputs.job_posting.application.label'](this.lang).toString(),
		});
		const applicationFieldset = this.page.getByRole('group').filter({
			has: applicationMethod,
		});
		const applicationLink = applicationFieldset.getByRole('textbox');

		this.form = {
			inputs: {
				id: this.page.getByTestId('id'),
				title: this.page.getByRole('textbox', {
					name: m['inputs.job_posting.title.label'](this.lang).toString(),
				}),
				type: this.page.getByRole('combobox', {
					name: m['inputs.job_posting.type.label'](this.lang).toString(),
				}),
				location: this.page.getByRole('textbox', {
					name: m['inputs.job_posting.location.label'](this.lang).toString(),
				}),
				salary: this.page.getByRole('textbox', {
					name: m['inputs.job_posting.salary.label'](this.lang).toString(),
				}),
				applicationMethod,
				applicationLink,
				expiredAt: this.page.getByLabel(
					m['inputs.job_posting.expired_at.label'](this.lang).toString(),
				),
				description: this.page.getByRole('textbox', {
					name: m['inputs.job_posting.desc.label'](this.lang).toString(),
				}),
			},
			submit: this.page.getByRole('button', {
				name: m['pages.postings_upsert.form.cta'](this.lang).toString(),
			}),
		};
	}

	async fill(data: typeof schema.jobPostings.$inferSelect) {
		await this.form.inputs.title.fill(data.title);
		await this.form.inputs.type.selectOption({ value: data.type });
		await this.form.inputs.location.fill(data.location);
		await this.form.inputs.salary.fill(data.salary);
		await this.form.inputs.applicationMethod.selectOption({ value: data.applicationMethod });
		await this.form.inputs.applicationLink.fill(data.applicationLink);
		await this.form.inputs.expiredAt.fill(formatDate(data.expiredAt, '-'));
		await this.form.inputs.description.fill(data.description);
	}

	async submit(id: string): Promise<import('./posting-details').PagePostingDetails> {
		await this.form.inputs.id.fill(id);

		// User clicks "Submit for Review" button
		this.form.submit.click();

		const promises: Promise<unknown>[] = [];

		// User sees alert of success creation
		const alert = this.page.getByRole('alert').filter({
			hasText: this.successMessage(this.lang).toString(),
		});
		promises.push(expect(alert).toBeVisible());

		// User is redirected to posting details page
		const { PagePostingDetails } = await import('./posting-details');
		const pomPostingDetails = new PagePostingDetails({ lang: this.lang, page: this.page, id });
		promises.push(pomPostingDetails.waitForPage());

		await Promise.all(promises);

		return pomPostingDetails;
	}
}
