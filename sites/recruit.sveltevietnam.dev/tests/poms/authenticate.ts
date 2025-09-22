import { expect, type Locator } from '@playwright/test';
import { formatRelativeTime } from '@sveltevietnam/kit/utilities/datetime';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';
import { generateTimestampedEmail, getWranglerVars } from '../utils';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './utils';

interface PageAuthenticateInit extends CommonPageObjectModelInit {
	data?: {
		/** generated with {@link generateTimestampedEmail} if not provided */
		email?: string;
	};
}

export class PageAuthenticate extends CommonPageObjectModel {
	public readonly path: string;

	public readonly data: {
		email: string;
	};

	public readonly inputs: {
		email: Locator;
	};

	public readonly ctas: {
		continue: Locator;
		resend: Locator;
	};

	constructor(init: PageAuthenticateInit) {
		super(init);
		this.path = p['/:lang/authenticate']({ lang: this.lang });
		this.data = {
			email: init.data?.email || generateTimestampedEmail(),
		};
		this.inputs = {
			email: this.page.getByRole('textbox', {
				name: m['inputs.email.label'](this.lang).toString(),
			}),
		};
		this.ctas = {
			continue: this.page.getByRole('button', {
				name: m['continue'](this.lang).toString(),
			}),
			resend: this.page.getByRole('button', {
				name: m['pages.authenticate.resend'](this.lang).toString(),
			}),
		};
	}

	async goto() {
		await this.page.goto(this.path);
	}

	async fill() {
		await expect(this.inputs.email).toBeVisible();
		await this.inputs.email.fill(this.data.email);
	}

	async submit() {
		// 1. User submits
		await expect(this.ctas.continue).toBeVisible();
		await expect(this.ctas.continue).toBeEnabled();
		await this.ctas.continue.click();

		// 2. User see button text updated to resent
		// and cannot click button during waiting time
		await expect(this.ctas.resend).toBeVisible();
		await expect(this.ctas.resend).toBeDisabled();

		// 3. User see authentication result with wait time
		const vars = getWranglerVars();
		const output = this.page.getByRole('status');
		await expect(output).toBeVisible();
		await expect(output).toContainText(
			m['pages.authenticate.callout.signup'](this.lang)({
				exp: formatRelativeTime(this.lang, vars.AUTHENTICATE_RESENT_WAITING_MS),
			}).toString(),
		);

		// 4. User can click resend after waiting time
		await expect(this.ctas.resend).toBeEnabled({
			timeout: vars.AUTHENTICATE_RESENT_WAITING_MS + 1000,
		});
	}
}
