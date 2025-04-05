import * as m from '$data/locales/generated/messages';
import { loadPerson, ids } from '$data/people';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		people: (
			await Promise.all(ids.map((id) => loadPerson(id, locals.sharedSettings.language, true)))
		).filter(Boolean),
		meta: {
			title: m['pages.people.title'](lang),
			description: m['pages.people.desc'](lang),
			// TODO: add OG images
		},
	};
};
