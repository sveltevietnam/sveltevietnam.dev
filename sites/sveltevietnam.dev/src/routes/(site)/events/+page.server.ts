import { loadEvents } from '$data/events';
import * as m from '$data/locales/generated/messages';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';
import ogImageEn from './_page/og-events.en.jpg?url';
import ogImageVi from './_page/og-events.vi.jpg?url';

const ogImage = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const lang = locals.sharedSettings.language;

	// TODO: sort by event status 'upcoming' | 'ongoing' | 'past'
	const { events } = await loadEvents(lang, 1, 10);

	return {
		events,
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
