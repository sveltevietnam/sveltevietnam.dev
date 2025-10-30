import { expect, type Locator } from '@playwright/test';
import type { MessageSimple } from '@sveltevietnam/i18n';
import type { Language } from '@sveltevietnam/i18n/generated';
import type { KeySimple } from '@sveltevietnam/i18n/generated';
import { formatDate } from '@sveltevietnam/kit/utilities/datetime';

import * as p from '../../src/data/routes/generated';
import * as m from '../../src/lib/i18n/generated/messages';
import { schema } from '../fixtures/with-backend';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export class PagePostingCreate extends CommonPageObjectModel {
	public readonly path: string;
	public readonly form: {
		inputs: {
			id: Locator;
			title: {
				input: Locator;
				error: Locator;
			};
			type: {
				input: Locator;
				error: Locator;
			};
			location: {
				input: Locator;
				error: Locator;
			};
			salary: {
				input: Locator;
				error: Locator;
			};
			applicationMethod: {
				input: Locator;
				error: Locator;
			};
			applicationLink: {
				input: Locator;
				error: Locator;
			};
			expiredAt: {
				input: Locator;
				error: Locator;
			};
			description: {
				input: Locator;
				error: Locator;
			};
		};
		submit: Locator;
	};
	public readonly successMessage: MessageSimple<Language, KeySimple> =
		m['pages.postings_upsert.notifications.create'];

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/postings/create']({ lang: this.lang });

		const applicationMethod = this.page.getByRole('combobox', {
			name: m['inputs.job_posting.application.label'](this.lang),
		});
		const applicationFieldset = this.page.getByRole('group').filter({
			has: applicationMethod,
		});
		const applicationLink = applicationFieldset.getByRole('textbox');

		this.form = {
			inputs: {
				id: this.page.getByTestId('id'),
				title: {
					input: this.page.getByRole('textbox', {
						name: m['inputs.job_posting.title.label'](this.lang),
					}),
					error: this.page.locator('#error-title'),
				},
				type: {
					input: this.page.getByRole('combobox', {
						name: m['inputs.job_posting.type.label'](this.lang),
					}),
					error: this.page.locator('#error-type'),
				},
				location: {
					input: this.page.getByRole('textbox', {
						name: m['inputs.job_posting.location.label'](this.lang),
					}),
					error: this.page.locator('#error-location'),
				},
				salary: {
					input: this.page.getByRole('textbox', {
						name: m['inputs.job_posting.salary.label'](this.lang),
					}),
					error: this.page.locator('#error-salary'),
				},
				applicationMethod: {
					input: applicationMethod,
					error: this.page.locator('#error-application-method'),
				},
				applicationLink: {
					input: applicationLink,
					error: this.page.locator('#error-application-link'),
				},
				expiredAt: {
					input: this.page.getByLabel(m['inputs.job_posting.expired_at.label'](this.lang)),
					error: this.page.locator('#error-expires-at'),
				},
				description: {
					input: this.page.getByRole('textbox', {
						name: m['inputs.job_posting.desc.label'](this.lang),
					}),
					error: this.page.locator('#error-description'),
				},
			},
			submit: this.page.getByRole('button', {
				name: m['pages.postings_upsert.form.cta'](this.lang),
			}),
		};
	}

	async fill(data: typeof schema.jobPostings.$inferSelect) {
		await this.form.inputs.title.input.fill(data.title);
		await this.form.inputs.type.input.selectOption({ value: data.type });
		await this.form.inputs.location.input.fill(data.location);
		await this.form.inputs.salary.input.fill(data.salary);
		await this.form.inputs.applicationMethod.input.selectOption({ value: data.applicationMethod });
		await this.form.inputs.applicationLink.input.fill(data.applicationLink);
		await this.form.inputs.expiredAt.input.fill(formatDate(data.expiredAt, '-'));

		await this.form.inputs.description.input.press('Control+A');
		await this.form.inputs.description.input.press('Backspace');
		await this.form.inputs.description.input.pressSequentially(data.description);
		await this.page.waitForTimeout(280); // wait for debounce of rich text editor output -> description input
	}

	async submit(id: string): Promise<import('./posting-details').PagePostingDetails> {
		await this.form.inputs.id.fill(id);

		// User clicks "Submit for Review" button
		this.form.submit.click();

		const promises: Promise<unknown>[] = [];

		// User sees alert of success creation
		const alert = this.page
			.getByRole('alert')
			.filter({
				hasText: this.successMessage(this.lang),
			})
			.first();
		promises.push(expect(alert).toBeVisible());

		// User is redirected to posting details page
		const { PagePostingDetails } = await import('./posting-details');
		const pomPostingDetails = new PagePostingDetails({ lang: this.lang, page: this.page, id });
		promises.push(pomPostingDetails.waitForPage());

		await Promise.all(promises);

		return pomPostingDetails;
	}
}
