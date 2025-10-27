import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import * as m from '$lib/i18n/generated/messages';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-sponsor.en.jpg?url';
import ogImageVi from './_page/og-sponsor.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	return {
		routing: {
			breadcrumbs: b['/:lang/sponsor']({ lang }),
			paths: {
				vi: p['/:lang/sponsor']({ lang: 'vi' }),
				en: p['/:lang/sponsor']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.sponsor.title'](lang),
			description: m['pages.sponsor.desc'](lang),
			keywords: m['pages.sponsor.keywords'](lang),
			og: {
				image: {
					src: ogImage[lang],
				},
			},
		},
	};
};
