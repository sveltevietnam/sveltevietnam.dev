import type { Locator } from '@playwright/test';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './utils';

export class PageWelcome extends CommonPageObjectModel {
	public readonly path: string;
	public readonly ctas: {
		create: Locator;
	};

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/welcome']({ lang: this.lang });
		this.ctas = {
			create: this.page.getByRole('link', {
				name: m['pages.welcome.cta'](this.lang).toString(),
			}),
		};
	}
}
