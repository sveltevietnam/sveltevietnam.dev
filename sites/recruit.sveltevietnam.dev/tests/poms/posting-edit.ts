import * as m from '../../src/data/locales/generated/messages';
import * as p from '../../src/data/routes/generated';

import { type CommonPageObjectModelInit } from './common';
import { PagePostingCreate } from './posting-create';

export interface PagePostingEditInit extends CommonPageObjectModelInit {
	id: string;
}

export class PagePostingEdit extends PagePostingCreate {
	public readonly path: string;
	public readonly id: string;
	public readonly successMessage = m['pages.postings_upsert.notifications.update'];

	constructor(init: PagePostingEditInit) {
		super(init);
		this.id = init.id;
		this.path = p['/:lang/postings/:id/edit']({ lang: this.lang, id: this.id });
	}
}
