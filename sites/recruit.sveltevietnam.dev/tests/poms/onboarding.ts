import { expect, type Locator } from '@playwright/test';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './utils';

export interface PageOnboardingFormData {
	name: string;
	description: string;
	website?: string;
	image?: string;
}

export class PageOnboarding extends CommonPageObjectModel {
	public readonly path: string;

	public readonly inputs: {
		name: Locator;
		description: Locator;
		image: Locator;
		website: Locator;
		agreement: Locator;
	};

	public readonly ctas: {
		submitForReview: Locator;
		useAnotherAccount: Locator;
	};

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/onboarding']({ lang: this.lang });
		this.inputs = {
			name: this.page.getByRole('textbox', {
				name: m['inputs.employer.name.label'](this.lang).toString(),
			}),
			website: this.page.getByRole('textbox', {
				name: m['inputs.employer.website.label'](this.lang).toString(),
			}),
			description: this.page.getByRole('textbox', {
				name: m['inputs.employer.desc.label'](this.lang).toString(),
			}),
			agreement: this.page.getByRole('checkbox', {
				name: m['inputs.employer.agreement.desc'](this.lang).toString(),
			}),
			image: this.page.getByTestId('image'),
		};
		this.ctas = {
			submitForReview: this.page.getByRole('button', {
				name: m['pages.onboarding.cta.submit'](this.lang).toString(),
			}),
			useAnotherAccount: this.page.getByRole('link', {
				name: m['pages.onboarding.cta.use_another_account'](this.lang).toString(),
			}),
		};
	}

	async goto() {
		await this.page.goto(this.path);
	}

	async waitForPage() {
		await this.page.waitForURL(this.path);
	}

	async fill(data: PageOnboardingFormData) {
		// 1. User fills text-based info
		await this.inputs.name.fill(data.name);
		if (data.website) await this.inputs.website.fill(data.website);
		await this.inputs.description.fill(data.description);

		// 2. User uploads image
		const fileChooserPromise = this.page.waitForEvent('filechooser');
		await this.inputs.image.click();
		const fileChooser = await fileChooserPromise;
		if (data.image) await fileChooser.setFiles(data.image);

		// 3. User checks agreement
		await this.inputs.agreement.check();
	}

	async submitForReview(): Promise<import('./welcome').PageWelcome> {
		this.ctas.submitForReview.click();

		// After submission, user is redirected to welcome page
		const { PageWelcome } = await import('./welcome');
		const pomWelcome = new PageWelcome({ page: this.page, lang: this.lang });
		await pomWelcome.waitForPage();
		await expect(pomWelcome.accountMenu.locator).toBeVisible();
		return pomWelcome;
	}

	async useAnotherAccount(): Promise<import('./authenticate').PageAuthenticate> {
		this.ctas.useAnotherAccount.click();

		// This link logs user out and redirects to authentication page
		const { PageAuthenticate } = await import('./authenticate');
		const pomAuthenticate = new PageAuthenticate({ page: this.page, lang: this.lang });
		await pomAuthenticate.waitForPage();
		await expect(pomAuthenticate.accountMenu.locator).toBeHidden();
		return pomAuthenticate;
	}
}
