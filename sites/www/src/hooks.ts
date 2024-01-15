import { DEFAULT_LANGUAGE, LANGUAGES, delocalizeLangVar } from '@internals/utils/language';
import { delocalizeUrl, getLangFromUrl, isUrlLocalized } from '@internals/utils/url';
import type { Reroute } from '@sveltejs/kit';

import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';
import { ROUTE_MAP } from '$lib/routing/routing.map';

const REROUTE_MAP = {
	// common pages
	...Object.values(ROUTE_MAP).reduce(
		(acc, routes) => {
			acc[routes.vi.path] = delocalizeUrl(routes[DEFAULT_LANGUAGE].path, LANGUAGES);
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
				delocalizeUrl(ROUTE_MAP.blog[DEFAULT_LANGUAGE].path, LANGUAGES) +
				'/' +
				delocalizedSlug[DEFAULT_LANGUAGE];
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
				delocalizeUrl(ROUTE_MAP.events[DEFAULT_LANGUAGE].path, LANGUAGES) +
				'/' +
				delocalizedSlug[DEFAULT_LANGUAGE];
			acc[viPath] = delocalizedDefaultPath;
			return acc;
		},
		{} as Record<string, string>,
	),
};

export const reroute: Reroute = ({ url }) => {
	const lang = getLangFromUrl(url, LANGUAGES);
	if (!lang) return url.pathname;

	let pathname = url.pathname;

	// dynamic subscriptions pages
	const subscriptionsViPath = ROUTE_MAP.subscriptions.vi.path;
	if (pathname.startsWith(subscriptionsViPath)) {
		return pathname.replace(subscriptionsViPath, REROUTE_MAP[subscriptionsViPath]);
	}

	// FIXME: workaround for https://github.com/sveltejs/kit/issues/11625
	let suffix = '';
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

	if (isUrlLocalized(url.pathname, DEFAULT_LANGUAGE)) {
		return delocalizeUrl(url.pathname, LANGUAGES);
	}
};
