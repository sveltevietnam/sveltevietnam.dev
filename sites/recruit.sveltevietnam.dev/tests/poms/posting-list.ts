import { expect, type Locator } from '@playwright/test';

import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { CommonPageObjectModel, type CommonPageObjectModelInit } from './common';

export class PagePostingList extends CommonPageObjectModel {
	public readonly path: string;
	public readonly ctas: {
		create: Locator;
	};
	public readonly sections: {
		active: Locator;
		pending: Locator;
		expired: Locator;
	};

	constructor(init: CommonPageObjectModelInit) {
		super(init);
		this.path = p['/:lang/postings']({ lang: this.lang });
		this.ctas = {
			create: this.page.getByRole('link', {
				name: m['pages.postings.active.create'](this.lang).toString(),
			}),
		};
		this.sections = {
			active: this.page.getByRole('region', {
				name: m['pages.postings.active.heading'](this.lang).toString(),
			}),
			pending: this.page.getByRole('region', {
				name: m['pages.postings.pending.heading'](this.lang).toString(),
			}),
			expired: this.page.getByRole('region', {
				name: m['pages.postings.expired.heading'](this.lang).toString(),
			}),
		};
	}

	async match(
		snapshots: {
			active?: string | null;
			pending?: string | null;
			expired?: string | null;
		} | null,
	) {
		const rSnapshots = {
			active: null,
			pending: null,
			expired: null,
			...snapshots,
		};

		const promises: Promise<unknown>[] = [];
		for (const key of Object.keys(rSnapshots) as (keyof typeof rSnapshots)[]) {
			const list = this.sections[key];
			const snapshot = rSnapshots[key];
			if (snapshot) {
				promises.push(expect(list).toMatchAriaSnapshot({ name: snapshot }));
			} else if (key !== 'active') {
				promises.push(expect(list).toBeHidden());
			}
		}
		await Promise.all(promises);
	}

	async create(): Promise<import('./posting-create').PagePostingCreate> {
		this.ctas.create.click();
		const { PagePostingCreate } = await import('./posting-create');
		const pagePostingCreate = new PagePostingCreate({
			page: this.page,
			lang: this.lang,
		});
		await pagePostingCreate.waitForPage();
		return pagePostingCreate;
	}

	async goToDetailPage(posting: {
		id: string;
		title: string;
	}): Promise<import('./posting-details').PagePostingDetails> {
		const link = this.page.getByRole('link', {
			name: posting.title,
		});
		await expect(link).toBeVisible();
		link.click();
		const { PagePostingDetails } = await import('./posting-details');
		const pagePostingDetails = new PagePostingDetails({
			page: this.page,
			lang: this.lang,
			id: posting.id,
		});
		await pagePostingDetails.waitForPage();
		return pagePostingDetails;
	}
}
