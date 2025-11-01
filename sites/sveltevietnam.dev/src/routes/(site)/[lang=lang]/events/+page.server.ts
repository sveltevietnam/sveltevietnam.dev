import { getEventStatus, loadEvents, type EventMetadata } from '$data/events';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { upsert } from '$lib/forms/subscriber/server';
import * as m from '$lib/i18n/generated/messages';

import type { Actions, PageServerLoad } from './$types';
import ogImageEn from './_page/og-events.en.jpg?url';
import ogImageVi from './_page/og-events.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;

	const { events } = await loadEvents({ lang });
	const upcoming: EventMetadata[] = [];
	const ongoing: EventMetadata[] = [];
	const past: EventMetadata[] = [];

	for (const event of events) {
		const status = getEventStatus(event);
		if (status === 'upcoming') upcoming.push(event);
		else if (status === 'ongoing') ongoing.push(event);
		else past.push(event);
	}

	return {
		subscribeFormData: await upsert.load(lang, 'event'),
		events: {
			upcoming,
			ongoing,
			past,
		},
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

export const actions: Actions = { subscribe: upsert.action };
