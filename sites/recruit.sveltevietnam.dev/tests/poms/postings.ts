import type { Locator } from '@playwright/test';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './utils';

export class PagePostings extends CommonPageObjectModel {
	public readonly path: string;
	public readonly ctas: {
		create: Locator;
	};

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/postings']({ lang: this.lang });
		this.ctas = {
			create: this.page.getByRole('link', {
				name: m['pages.postings.active.create'](this.lang).toString(),
			}),
		};
	}

	async goto() {
		await this.page.goto(this.path);
	}

	async waitForPage() {
		await this.page.waitForURL(this.path);
	}
}
