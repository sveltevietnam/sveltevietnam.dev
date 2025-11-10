import * as m from '@sveltevietnam/i18n/generated/messages';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-events.en.jpg?url';
import ogImageVi from './_page/og-events.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	return {
		routing: {
			breadcrumbs: b['/:lang/events']({ lang }),
			paths: {
				vi: p['/:lang/events']({ lang: 'vi' }),
				en: p['/:lang/events']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.events.title'](lang),
			description: m['pages.events.desc'](lang),
			keywords: m['pages.events.keywords'](lang),
			og: {
				image: {
					src: ogImage[lang],
				},
			},
		},
	};
};
