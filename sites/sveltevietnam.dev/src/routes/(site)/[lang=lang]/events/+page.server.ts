import { loadEvents } from '$data/events';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-events.en.jpg?url';
import ogImageVi from './_page/og-events.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const prerender = false;

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	// TODO: sort by event status 'upcoming' | 'ongoing' | 'past'
	const { events } = await loadEvents(lang, 1, 10);

	return {
		events,
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
				image: ogImage[lang],
			},
		},
	};
};
