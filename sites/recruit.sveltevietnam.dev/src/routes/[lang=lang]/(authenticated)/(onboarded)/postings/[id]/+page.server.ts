import { superValidate } from 'sveltekit-superforms';
import { valibot } from 'sveltekit-superforms/adapters';
import * as v from 'valibot';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ params, parent }) => {
	const { lang, id } = params;
	const parentData = await parent();

	const deleteSchema = v.object({
		id: v.pipe(v.string(), v.nonEmpty()),
	});
	return {
		...parentData,
		deleteForm: await superValidate({ id }, valibot(deleteSchema)),
		routing: {
			breadcrumbs: b['/:lang/postings/:id']({ lang, id: [id, parentData.posting.title] }),
			paths: {
				vi: p['/:lang/postings/:id']({ lang: 'vi', id }),
				en: p['/:lang/postings/:id']({ lang: 'en', id }),
			},
		},
	};
};

export const actions: Actions = {
	delete: async () => {
		// TODO: implement this
	},
};
