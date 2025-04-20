import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-coc.en.jpg?url';
import ogImageVi from './_page/og-coc.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	return {
		meta: {
			title: m['pages.coc.title'](lang),
			description: m['pages.coc.desc'](lang),
			keywords: m['pages.coc.keywords'](lang),
			og: {
				image: ogImage[lang],
			},
		},
	};
};
