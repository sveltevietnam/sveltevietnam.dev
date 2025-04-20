import * as m from '$data/locales/generated/messages';
import { loadPerson, ids } from '$data/people';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-people.en.jpg?url';
import ogImageVi from './_page/og-people.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		routing: {
			breadcrumbs: b['/:lang/people']({ lang }),
			paths: {
				vi: p['/:lang/people']({ lang: 'vi' }),
				en: p['/:lang/people']({ lang: 'en' }),
			},
		},
		people: (
			await Promise.all(
				ids.map((id) =>
					loadPerson(id, locals.sharedSettings.language, {
						popImage: true,
						avatar: true,
					}),
				),
			)
		).filter(Boolean),
		meta: {
			title: m['pages.people.title'](lang),
			description: m['pages.people.desc'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
