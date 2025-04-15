import { error } from '@sveltejs/kit';

import {
	loadEventAdditionalStructuredData,
	loadEventBySlug,
	loadEventMetadata,
	loadEventOgImage,
} from '$data/events';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredEvent } from '$lib/meta/structured/events';
import { buildRoutes } from '$lib/routing/utils';

import ogImageEn from '../_page/og-events.en.jpg?url';
import ogImageVi from '../_page/og-events.vi.jpg?url';

import type { PageServerLoad } from './$types';

const ogImageFallback = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const load: PageServerLoad = async ({ parent, params, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const otherLang = lang === 'en' ? 'vi' : 'en';

	const event = await loadEventBySlug(params.slug, lang);
	if (!event) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Event not found', code: 'SV000' });
	}

	const [otherLangMetadata, ogImage, additionalStructuredData, { routing }] = await Promise.all([
		loadEventMetadata(event.id, otherLang),
		loadEventOgImage(event.id),
		loadEventAdditionalStructuredData(event.id, lang, VITE_PUBLIC_ORIGIN),
		parent(),
	]);

	const routeParam = {
		name: event.title,
		path: event.slug,
	};

	const otherLangRouteParam = otherLangMetadata
		? {
				name: otherLangMetadata.title,
				path: otherLangMetadata.slug,
			}
		: routeParam;

	return {
		event,
		editUrl: `https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/data/events/${event.id}/content.svelte`,
		lang,
		routing: {
			...routing,
			breadcrumbs: buildRoutes(routing.breadcrumbs, routeParam),
			paths: {
				[lang]: buildRoutes(routing.paths[lang], routeParam),
				[otherLang]: buildRoutes(routing.paths[otherLang], otherLangRouteParam),
			},
		},
		meta: {
			structured: buildStructuredEvent(lang, VITE_PUBLIC_ORIGIN, event, additionalStructuredData),
			title: `${event.title}`,
			description: event.description,
			keywords: event.keywords,
			og: {
				image: ogImage ?? ogImageFallback[lang],
			},
		},
	};
};
