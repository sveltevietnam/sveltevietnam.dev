import { error } from '@sveltejs/kit';

import {
	loadEventAdditionalStructuredData,
	loadEventBySlug,
	loadEventMetadata,
	loadEventOgImage,
} from '$data/events';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { buildStructuredEvent } from '$lib/meta/structured/events';

import ogImageEn from '../_page/og-events.en.jpg?url';
import ogImageVi from '../_page/og-events.vi.jpg?url';

import type { PageServerLoad } from './$types';

const ogImageFallback = {
	vi: ogImageVi,
	en: ogImageEn,
};

// TODO: export `entries` to support prerendering, once routing strategy has matured
// @see {@link https://svelte.dev/docs/kit/page-options#entries}

export const load: PageServerLoad = async ({ params, locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const lang = locals.sharedSettings.language;
	const otherLang = lang === 'en' ? 'vi' : 'en';

	const event = await loadEventBySlug(params.slug, lang);
	if (!event) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Event not found', code: 'SV000' });
	}

	const [otherLangMetadata, ogImage, additionalStructuredData] = await Promise.all([
		loadEventMetadata(event.id, otherLang),
		loadEventOgImage(event.id),
		loadEventAdditionalStructuredData(event.id, lang, VITE_PUBLIC_ORIGIN),
	]);

	const breadcrumbs = b['/:lang/events/:slug']({
		lang,
		slug: [event.slug, event.title],
	});
	const paths = {
		[lang]: p['/:lang/events/:slug']({ lang, slug: event.slug }),
		[otherLang]: p['/:lang/events/:slug']({
			lang: otherLang,
			slug: otherLangMetadata?.slug ?? event.slug,
		}),
	} as Record<App.Language, string>;

	return {
		event,
		editUrl: `https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/data/events/${event.id}/content.svelte`,
		lang,
		routing: { breadcrumbs, paths },
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
