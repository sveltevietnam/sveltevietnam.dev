import { localizeLangVar } from '@internals/utils/language';

import { LOAD_DEPENDENCIES } from '$lib/constants';
import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';
import { prepareRoutePageData } from '$lib/routing/routing.server';

import type { PageServerLoad } from './$types';
import { translations } from './_page/translation';

const metaTranslations = {
	vi: {
		title: 'Sơ đồ trang | Svelte Việt Nam',
		description: 'Danh sách các trang của Svelte Việt Nam',
		keywords: ['liệt kê', 'trang', 'danh sách', 'sitemap'],
	},
	en: {
		title: 'Sitemap | Svelte Vietnam',
		description: 'A listing of pages within Svelte Vietnam',
		keywords: ['list', 'page', 'sitemap'],
	},
};

export const load: PageServerLoad = ({ depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const events = EVENTS.map((e) => ({
		title: localizeLangVar(locals.settings.language, e.title),
		slug: localizeLangVar(locals.settings.language, e.slug),
	}));

	const posts = INTERNAL_POSTS.map((p) => ({
		title: localizeLangVar(locals.settings.language, p.title),
		slug: localizeLangVar(locals.settings.language, p.slug),
	}));

	return {
		route: prepareRoutePageData(lang, 'sitemap'),
		events,
		posts,
		translations: {
			page: translations[lang],
		},
		meta: metaTranslations[lang],
	};
};
