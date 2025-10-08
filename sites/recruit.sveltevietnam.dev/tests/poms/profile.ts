import { type Locator, expect } from '@playwright/test';
import type { Message } from '@sveltevietnam/i18n/runtime';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

type ChangeEmailOutput =
	| {
			type: 'success';
			message: Message<'string', never>;
	  }
	| {
			type: 'error';
			message: Message<'string', never>;
	  };

export interface UpdateInfoFormData {
	name: string;
	description: string;
	website?: string | null;
	image?: string | null;
}

export class PageProfile extends CommonPageObjectModel {
	public readonly path: string;
	public readonly forms: {
		email: {
			input: Locator;
			save: Locator;
			alert: Locator;
			error: Locator;
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

		const sectionEmail = this.page.getByRole('region', {
			name: m['pages.profile.update_email.heading'](this.lang).toString(),
		});
		const sectionInfo = this.page.getByRole('region', {
			name: m['pages.profile.update_info.heading'](this.lang).toString(),
		});

		this.forms = {
			email: {
				input: sectionEmail.getByRole('textbox', {
					name: m['inputs.email.label'](this.lang).toString(),
				}),
				save: sectionEmail.getByRole('button', {
					name: m['save'](this.lang).toString(),
				}),
				alert: sectionEmail.getByRole('alert'),
				error: sectionEmail.locator('#error-email'),
			},
			info: {
				inputs: {
					name: sectionInfo.getByRole('textbox', {
						name: m['inputs.employer.name.label'](this.lang).toString(),
					}),
					website: sectionInfo.getByRole('textbox', {
						name: m['inputs.employer.website.label'](this.lang).toString(),
					}),
					description: sectionInfo.getByRole('textbox', {
						name: m['inputs.employer.desc.label'](this.lang).toString(),
					}),
					agreement: sectionInfo.getByRole('checkbox', {
						name: m['inputs.employer.agreement.desc'](this.lang).toString(),
					}),
					image: sectionInfo.getByTestId('image'),
				},
				imagePreview: sectionInfo.getByTestId('image-preview'),
				save: sectionInfo.getByRole('button', {
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
			expect(this.forms.info.inputs.description).toHaveText(data.description.replace(/\n/g, '')),
			expect(this.forms.info.inputs.website).toHaveValue(data.website ?? ''),
			expect(this.forms.info.inputs.agreement).toBeChecked(),
			data.image
				? expect(this.forms.info.imagePreview).toHaveAttribute('src', data.image)
				: expect(this.forms.info.imagePreview).toBeHidden(),
		]);
	}

	async changeEmail(data: { email: string }, output: ChangeEmailOutput) {
		await this.forms.email.input.fill(data.email);
		await this.forms.email.save.click();
		if (output.type === 'success') {
			await expect(this.forms.email.alert).toHaveText(output.message(this.lang).toString());
		} else {
			await expect(this.forms.email.error).toHaveText(output.message(this.lang).toString());
		}
	}

	async fillInfoForm(data: UpdateInfoFormData) {
		// 1. User fills text-based info
		await this.forms.info.inputs.name.fill(data.name);
		if (data.website) await this.forms.info.inputs.website.fill(data.website);

		await this.forms.info.inputs.description.press('Control+A');
		await this.forms.info.inputs.description.press('Backspace');
		await this.forms.info.inputs.description.pressSequentially(data.description);
		await this.page.waitForTimeout(280); // wait for debounce of rich text editor output -> description input

		// 2. User uploads image
		const fileChooserPromise = this.page.waitForEvent('filechooser');
		await this.forms.info.inputs.image.click();
		const fileChooser = await fileChooserPromise;
		if (data.image) await fileChooser.setFiles(data.image);

		// 3. User checks agreement
		await this.forms.info.inputs.agreement.check();
	}

	async saveInfo(message: Message<'string', never>): Promise<void> {
		await this.forms.info.save.click();
		const alert = this.page.getByRole('alert').filter({
			hasText: message(this.lang).toString(),
		});
		await expect(alert).toBeVisible();
	}
}
