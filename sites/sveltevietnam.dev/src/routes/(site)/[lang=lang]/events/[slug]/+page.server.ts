import { error } from '@sveltejs/kit';
import type { Language } from '@sveltevietnam/i18n';

import {
	generateKitEntries,
	loadEventAdditionalStructuredData,
	loadEventBySlug,
	loadEventMetadata,
	loadEventOgImage,
} from '$data/events';
import * as p from '$data/routes/generated';
import * as b from '$data/routes/generated/breadcrumbs';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';
import { buildStructuredEvent } from '$lib/meta/structured/events';

import ogImageEn from '../_page/og-events.en.jpg?url';
import ogImageVi from '../_page/og-events.vi.jpg?url';

import type { PageServerLoad, EntryGenerator } from './$types';

const ogImageFallback = {
	vi: ogImageVi,
	en: ogImageEn,
};

export const entries: EntryGenerator = () => {
	return generateKitEntries();
};

export const load: PageServerLoad = async ({ params }) => {
	const { lang } = params;
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
		slug: [event.href, event.title],
	});
	const paths = {
		[lang]: p['/:lang/events/:slug']({ lang, slug: event.href }),
		[otherLang]: p['/:lang/events/:slug']({
			lang: otherLang,
			slug: otherLangMetadata?.href ?? event.href,
		}),
	} as Record<Language, string>;

	return {
		event,
		editUrl: `https://github.com/sveltevietnam/sveltevietnam.dev/edit/main/sites/sveltevietnam.dev/src/data/events/${event.id}/content.svelte`,
		lang,
		routing: { breadcrumbs, paths },
		meta: {
			structured: buildStructuredEvent(lang, VITE_PUBLIC_ORIGIN, event, additionalStructuredData),
			title: `${event.title}`,
			description: event.description,
			keywords: event.keywords,
			og: {
				image: {
					src: ogImage ?? ogImageFallback[lang],
				},
			},
		},
	};
};
