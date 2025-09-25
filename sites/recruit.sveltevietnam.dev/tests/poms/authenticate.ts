import { expect, type Locator } from '@playwright/test';
import { formatRelativeTime } from '@sveltevietnam/kit/utilities/datetime';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export class PageAuthenticate extends CommonPageObjectModel {
	public readonly path: string;

	public readonly inputs: {
		email: Locator;
	};

	public readonly ctas: {
		continue: Locator;
		resend: Locator;
	};

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/authenticate']({ lang: this.lang });
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

	async fill(email: string) {
		await expect(this.inputs.email).toBeVisible();
		await this.inputs.email.fill(email);
	}

	async continue(authType: 'login' | 'signup') {
		// 1. User submits
		await expect(this.ctas.continue).toBeVisible();
		await expect(this.ctas.continue).toBeEnabled();
		await this.ctas.continue.click();

		// 2. User see button text updated to resent
		// and cannot click button during waiting time
		await expect(this.ctas.resend).toBeVisible();
		await expect(this.ctas.resend).toBeDisabled();

		// 3. User see authentication result with wait time
		await this.expectOutput(authType);
	}

	async resend(authType: 'login' | 'signup') {
		// 1. User can click resend after waiting time
		await expect(this.ctas.resend).toBeEnabled({
			timeout: this.vars.AUTHENTICATE_RESENT_WAITING_MS + 1000,
		});

		// 2. User clicks resend button
		await this.ctas.resend.click();

		// 3. User see authentication result with wait time
		await this.expectOutput(authType);
	}

	private async expectOutput(authType: 'login' | 'signup') {
		const output = this.page.getByRole('alert');
		await expect(output).toBeVisible();
		if (authType === 'login') {
			await expect(output).toContainText(
				m['pages.authenticate.callout.login'](this.lang)({
					exp: formatRelativeTime(this.lang, this.vars.AUTHENTICATE_RESENT_WAITING_MS),
				}).toString(),
			);
		} else {
			await expect(output).toContainText(
				m['pages.authenticate.callout.signup'](this.lang)({
					exp: formatRelativeTime(this.lang, this.vars.AUTHENTICATE_RESENT_WAITING_MS),
				}).toString(),
			);
		}
	}

	public async expectError(error: 'EXPIRED_TOKEN' | 'INVALID_TOKEN' | 'UNKNOWN') {
		const output = this.page.getByRole('alert');
		await expect(output).toBeVisible();
		if (error === 'EXPIRED_TOKEN') {
			await expect(output).toContainText(
				m['pages.authenticate.error.token_expired'](this.lang).toString(),
			);
		} else if (error === 'INVALID_TOKEN') {
			await expect(output).toContainText(
				m['pages.authenticate.error.token_invalid'](this.lang).toString(),
			);
		} else {
			await expect(output).toContainText(
				m['pages.authenticate.error.generic'](this.lang).toString(),
			);
		}
	}
}
