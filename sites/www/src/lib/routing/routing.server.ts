import { localizeLangVar, delocalizeLangVar, LANGUAGES } from '@internals/utils/language';
import { getLangFromUrl } from '@internals/utils/url';

import { ROUTE_MAP } from './routing.map';

export function prepareRoutePageData(
	lang: App.Language,
	key: keyof typeof ROUTE_MAP,
): App.PageData['route'] {
	const routes = ROUTE_MAP[key] as Record<App.Language, Omit<App.Route, 'key'>>;
	return {
		current: {
			key,
			...localizeLangVar(lang, routes),
		},
		alternate: delocalizeLangVar(routes),
	};
}

export type Breadcrumb = {
	label: string;
	href?: string;
};

export function findRouteFromUrl(url: URL) {
	const lang = getLangFromUrl(url, LANGUAGES);
	if (!lang) return undefined;
	const pathname = url.pathname;
	const matches = Object.values(ROUTE_MAP)
		.filter((routes) => pathname.startsWith(routes[lang].path))
		.sort((a, b) => a[lang].path.length - b[lang].path.length);
	return matches.at(-1);
}

/**
 * Computationally hungry, use in server only
 */
export function buildBreadcrumbs(pathname: string, ...params: Breadcrumb[]) {
	const crumbs: Breadcrumb[] = [];
	if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);

	const predefinedRoutes = Object.values(ROUTE_MAP).flatMap((routes) =>
		Object.values(routes),
	) as Omit<App.Route, 'key'>[];

	const segments = pathname.split('/');
	for (let i = 1; i <= segments.length; i++) {
		const path = segments.slice(0, i).join('/');

		const matchingRoute = predefinedRoutes.find((p) => p.path === path);
		if (matchingRoute) {
			crumbs.push({
				label: matchingRoute.label,
				href: i === segments.length ? undefined : matchingRoute.path,
			});
		} else {
			const shifted = params.shift();
			if (shifted) crumbs.push(shifted);
		}
	}

	return crumbs;
}
