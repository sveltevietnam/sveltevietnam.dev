import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-jobs.en.jpg?url';
import ogImageVi from './_page/og-jobs.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const prerender = false;

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		routing: {
			breadcrumbs: b['/:lang/jobs']({ lang }),
			paths: {
				vi: p['/:lang/jobs']({ lang: 'vi' }),
				en: p['/:lang/jobs']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.jobs.title'](lang),
			description: m['pages.jobs.desc'](lang),
			keywords: m['pages.jobs.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
