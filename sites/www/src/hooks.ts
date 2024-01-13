import { delocalizeUrl, getLangFromUrl, isUrlLocalized } from '@internals/utils/url';
import type { Reroute } from '@sveltejs/kit';

import { ROUTE_MAP } from '$client/contexts/navigation';
import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';
import { LANGUAGES, delocalizeLangVar, DEFAULT_LANG } from '$shared/services/i18n';

const REROUTE_MAP = {
	// common pages
	...Object.values(ROUTE_MAP).reduce(
		(acc, routes) => {
			acc[routes.vi.path] = delocalizeUrl(routes[DEFAULT_LANG].path, LANGUAGES);
			return acc;
		},
		{} as Record<string, string>,
	),

	// blog post pages
	...INTERNAL_POSTS.reduce(
		(acc, post) => {
			const delocalizedSlug = delocalizeLangVar(post.slug);
			const viPath = ROUTE_MAP.blog.vi.path + '/' + delocalizedSlug.vi;
			const delocalizedDefaultPath =
				delocalizeUrl(ROUTE_MAP.blog[DEFAULT_LANG].path, LANGUAGES) +
				'/' +
				delocalizedSlug[DEFAULT_LANG];
			acc[viPath] = delocalizedDefaultPath;
			return acc;
		},
		{} as Record<string, string>,
	),

	// event detail pages
	...EVENTS.reduce(
		(acc, event) => {
			const delocalizedSlug = delocalizeLangVar(event.slug);
			const viPath = ROUTE_MAP.events.vi.path + '/' + delocalizedSlug.vi;
			const delocalizedDefaultPath =
				delocalizeUrl(ROUTE_MAP.events[DEFAULT_LANG].path, LANGUAGES) +
				'/' +
				delocalizedSlug[DEFAULT_LANG];
			acc[viPath] = delocalizedDefaultPath;
			return acc;
		},
		{} as Record<string, string>,
	),
};

export const reroute: Reroute = ({ url }) => {
	const lang = getLangFromUrl(url, LANGUAGES);
	if (!lang) return url.pathname;

	// FIXME: workaround for https://github.com/sveltejs/kit/issues/11625
	let suffix = '';
	let pathname = url.pathname;
	const segments = pathname.split('/');
	const lastSegment = segments.at(-1);
	if (lastSegment && /\.\w+$/.test(lastSegment)) {
		suffix = '/' + lastSegment;
		pathname = segments.slice(0, -1).join('/');
	}

	// high-level static pages
	if (pathname in REROUTE_MAP) {
		const reroutedPath = (REROUTE_MAP[pathname] + suffix).replace(/^\/+/, '/');
		return reroutedPath;
	}

	if (isUrlLocalized(url.pathname, DEFAULT_LANG)) {
		return delocalizeUrl(url.pathname, LANGUAGES);
	}
};
