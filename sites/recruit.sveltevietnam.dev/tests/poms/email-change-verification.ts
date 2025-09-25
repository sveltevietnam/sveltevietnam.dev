import { expect, type Locator } from '@playwright/test';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export class PageEmailChangeVerification extends CommonPageObjectModel {
	public readonly path: string;
	public readonly token: string;

	public readonly heading: Locator;
	public readonly result: Locator;

	constructor(init: CommonPageObjectModelInit & { token: string }) {
		super(init);
		this.token = init.token;
		this.path = p['/:lang/email-change-verification/:token']({
			lang: this.lang,
			token: this.token,
		});

		this.heading = this.page.getByRole('heading', { level: 1 });
		this.result = this.page.getByTestId('result');
	}

	async match(status: 'ok' | 'invalid' | 'expired' | 'unknown') {
		const promises: Promise<void>[] = [];

		switch (status) {
			case 'ok':
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.ok'](this.lang).toString(),
					),
					expect(this.result).toHaveText(
						m['pages.email_change_verification.desc.ok'](this.lang).toString(),
					),
				);
				break;
			case 'invalid':
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.invalid'](this.lang).toString(),
					),
					expect(this.result).toHaveText(
						m['pages.email_change_verification.desc.invalid'](this.lang).toString(),
					),
				);
				break;
			case 'expired':
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.expired'](this.lang).toString(),
					),
					expect(this.result).toHaveText(
						m['pages.email_change_verification.desc.expired'](this.lang).toString(),
					),
				);
				break;
			case 'unknown':
			default:
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.unknown'](this.lang).toString(),
					),
					expect(this.result).toHaveText(m['errors.generic'](this.lang).toString()),
				);
				break;
		}

		await Promise.all(promises);
	}
}
