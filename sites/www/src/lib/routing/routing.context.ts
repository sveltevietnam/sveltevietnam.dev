import { localizeLangVar } from '@internals/utils/language';
import { getContext, setContext } from 'svelte';
import { derived, writable, type Readable } from 'svelte/store';

import { ROUTE_MAP, UNIVERSAL_ROUTE_MAP } from './routing.map';

const ROUTING_CONTEXT_ID = 'navigation';

export function setRoutingContext(
	lang: Readable<App.Language>,
	initialRoute: App.PageData['route'],
) {
	const route = writable(initialRoute);
	return setContext(ROUTING_CONTEXT_ID, {
		current: route,
		is: derived(route, ($route) => (url: URL | string) => {
			const pathname = typeof url === 'string' ? url : url.pathname;
			if (pathname === ROUTE_MAP.home.en.path || pathname === ROUTE_MAP.home.vi.path) {
				return pathname === $route.current.path;
			}
			return $route.current.path.startsWith(pathname);
		}),
		routes: derived(lang, ($lang) => ({
			...UNIVERSAL_ROUTE_MAP,
			...Object.entries(ROUTE_MAP).reduce(
				(acc, [key, routes]) => {
					acc[key as keyof typeof ROUTE_MAP] = localizeLangVar(
						$lang,
						routes as Record<App.Language, Omit<App.Route, 'key'>>,
					);
					return acc;
				},
				{} as Record<keyof typeof ROUTE_MAP, Omit<App.Route, 'key'>>,
			),
		})),
	});
}

export function getRoutingContext() {
	return getContext<ReturnType<typeof setRoutingContext>>(ROUTING_CONTEXT_ID);
}
