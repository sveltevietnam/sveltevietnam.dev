import { expect, type Locator } from '@playwright/test';

import * as p from '../../src/data/routes/generated';
import * as m from '../../src/lib/i18n/generated/messages';

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
						m['pages.email_change_verification.heading.ok'](this.lang),
					),
					expect(this.result).toHaveText(m['pages.email_change_verification.desc.ok'](this.lang)),
				);
				break;
			case 'invalid':
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.invalid'](this.lang),
					),
					expect(this.result).toHaveText(
						m['pages.email_change_verification.desc.invalid'](this.lang),
					),
				);
				break;
			case 'expired':
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.expired'](this.lang),
					),
					expect(this.result).toHaveText(
						m['pages.email_change_verification.desc.expired'](this.lang, { profilePath: '' }),
					),
				);
				break;
			case 'unknown':
			default:
				promises.push(
					expect(this.heading).toHaveText(
						m['pages.email_change_verification.heading.unknown'](this.lang),
					),
					expect(this.result).toHaveText(m['errors.generic'](this.lang)),
				);
				break;
		}

		await Promise.all(promises);
	}
}
