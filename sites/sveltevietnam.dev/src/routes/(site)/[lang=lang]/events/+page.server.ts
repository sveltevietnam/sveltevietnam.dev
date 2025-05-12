import { loadEvents } from '$data/events';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import * as subscribe from '$lib/forms/subscribe/server';

import type { Actions, PageServerLoad } from './$types';
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
		subscribeFormData: await subscribe.load(lang, 'event'),
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

export const actions: Actions = { subscribe: subscribe.action };
