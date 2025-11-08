import type { Language } from '@sveltevietnam/kit/constants';

import { getEventBySlug } from '$data/events';
import {
	generateKitEntries,
	loadEventAdditionalStructuredData,
	loadEventMetadata,
} from '$data/events/entries';
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
	const { lang, slug } = params;
	const otherLang = lang === 'en' ? 'vi' : 'en';

	const event = await getEventBySlug({ slug, lang, optionalModules: { ogImage: true } });

	const [otherLangMetadata, additionalStructuredData] = await Promise.all([
		loadEventMetadata(event.id, otherLang),
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
					src: event.ogImage ?? ogImageFallback[lang],
				},
			},
		},
	};
};
