import { LOAD_DEPENDENCIES } from '$lib/constants';
import { prepareRoutePageData } from '$lib/routing/routing.server';
// import { throwSvelteKitError } from '$lib/errors';

import type { PageServerLoad } from './$types';
import { translations as pageT } from './_page/translation';

export const prerender = false;

const metaTranslations: Record<App.Language, App.PageData['meta']> = {
	vi: {
		title: 'Tự Check-in | Sự kiện | Svelte Việt Nam',
		description: 'Gặp gỡ cộng đồng Svelte tại Việt Nam',
	},
	en: {
		title: 'Self Check-in | Events | Svelte Vietnam',
		description: 'Meet up with people of Svelte in Vietnam',
	},
};

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	// const qr = url.searchParams.get('qr');
	// const d1 = platform?.env?.D1;
	// if (!d1) throwSvelteKitError('D1_NOT_AVAILABLE');
	// TODO: complete later in #240
	const lang = locals.settings.language;
	return {
		route: prepareRoutePageData(lang, 'events_selfCheckIn'),
		translations: {
			page: pageT[lang],
		},
		meta: metaTranslations[lang],
	};
};
