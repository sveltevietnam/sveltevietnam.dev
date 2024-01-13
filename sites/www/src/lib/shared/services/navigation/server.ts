import { LANGUAGES } from '@internals/isc/common';
import { delocalizeUrl, getLangFromUrl } from '@internals/utils/url';

import { ROUTE_MAP } from '$client/contexts/navigation';

import { type Breadcrumb, ALL_PATHS, getPathLabel } from '.';

/**
 * Computationally hungry, use in server only
 */
export function __legacy__buildBreadcrumbs(pathname: string, ...params: Breadcrumb[]) {
	const lang = getLangFromUrl(pathname, LANGUAGES) ?? 'vi';
	const crumbs: Breadcrumb[] = [];
	if (pathname.length > 1 && pathname.endsWith('/')) pathname = pathname.slice(0, -1);
	const chunks = delocalizeUrl(pathname, LANGUAGES).split('/');
	for (let i = 0; i < chunks.length; i++) {
		const chunk = chunks[i];
		const path = ALL_PATHS.find((p) => p.split('/').at(-1) === chunk);
		if (!path) {
			const shifted = params.shift();
			if (shifted) crumbs.push(shifted);
		} else {
			crumbs.push({
				label: getPathLabel(path, lang),
				href: i === chunks.length - 1 ? undefined : path,
			});
		}
	}

	return crumbs;
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
