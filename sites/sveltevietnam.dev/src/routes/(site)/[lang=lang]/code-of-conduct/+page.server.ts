import * as m from '@sveltevietnam/i18n/generated/messages';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-coc.en.jpg?url';
import ogImageVi from './_page/og-coc.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	return {
		routing: {
			breadcrumbs: b['/:lang/code-of-conduct']({ lang }),
			paths: {
				vi: p['/:lang/code-of-conduct']({ lang: 'vi' }),
				en: p['/:lang/code-of-conduct']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.coc.title'](lang),
			description: m['pages.coc.desc'](lang),
			keywords: m['pages.coc.keywords'](lang),
			og: {
				image: {
					src: ogImage[lang],
				},
			},
		},
	};
};
