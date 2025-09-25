import { type Locator, expect } from '@playwright/test';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export class PageProfile extends CommonPageObjectModel {
	public readonly path: string;
	public readonly forms: {
		email: {
			input: Locator;
			save: Locator;
		};
		info: {
			inputs: {
				name: Locator;
				description: Locator;
				image: Locator;
				website: Locator;
				agreement: Locator;
			};
			imagePreview: Locator;
			save: Locator;
		};
	};

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/profile']({ lang: this.lang });

		const formEmail = this.page.getByRole('form', {
			name: m['pages.profile.update_email.heading'](this.lang).toString(),
		});
		const formInfo = this.page.getByRole('form', {
			name: m['pages.profile.update_info.heading'](this.lang).toString(),
		});

		this.forms = {
			email: {
				input: formEmail.getByRole('textbox', {
					name: m['inputs.email.label'](this.lang).toString(),
				}),
				save: formEmail.getByRole('button', {
					name: m['save'](this.lang).toString(),
				}),
			},
			info: {
				inputs: {
					name: formInfo.getByRole('textbox', {
						name: m['inputs.employer.name.label'](this.lang).toString(),
					}),
					website: formInfo.getByRole('textbox', {
						name: m['inputs.employer.website.label'](this.lang).toString(),
					}),
					description: formInfo.getByRole('textbox', {
						name: m['inputs.employer.desc.label'](this.lang).toString(),
					}),
					agreement: formInfo.getByRole('checkbox', {
						name: m['inputs.employer.agreement.desc'](this.lang).toString(),
					}),
					image: formInfo.getByTestId('image'),
				},
				imagePreview: formInfo.getByTestId('image-preview'),
				save: formEmail.getByRole('button', {
					name: m['save'](this.lang).toString(),
				}),
			},
		};
	}

	async match(data: {
		email: string;
		name: string;
		description: string;
		website?: string | null;
		image?: string | null;
	}) {
		await Promise.all([
			expect(this.forms.email.input).toHaveValue(data.email),
			expect(this.forms.info.inputs.name).toHaveValue(data.name),
			expect(this.forms.info.inputs.description).toHaveValue(data.description),
			expect(this.forms.info.inputs.website).toHaveValue(data.website ?? ''),
			expect(this.forms.info.inputs.agreement).toBeChecked(),
			data.image
				? expect(this.forms.info.imagePreview).toHaveAttribute('src', data.image)
				: expect(this.forms.info.imagePreview).toBeHidden(),
		]);
	}
}
