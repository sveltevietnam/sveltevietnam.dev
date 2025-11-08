import * as m from '@sveltevietnam/i18n/generated/messages';

import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-people.en.jpg?url';
import ogImageVi from './_page/og-people.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
	return {
		routing: {
			breadcrumbs: b['/:lang/people']({ lang }),
			paths: {
				vi: p['/:lang/people']({ lang: 'vi' }),
				en: p['/:lang/people']({ lang: 'en' }),
			},
		},
		meta: {
			title: m['pages.people.title'](lang),
			description: m['pages.people.desc'](lang),
			og: {
				image: {
					src: ogImage[lang],
				},
			},
		},
	};
};
