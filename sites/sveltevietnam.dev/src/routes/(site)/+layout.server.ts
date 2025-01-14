import { loadRoutingMap } from '$data/routing';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { getOgImagePath } from '$routes/loaders';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const routingMap = loadRoutingMap();
	const lang = locals.sharedSettings.language;
	const routingKey = (route.id
		// remove layout group (...)
		.replace(/\/\([^)]*\)/g, '')
		// replace [[param=...]] with :param
		.replace(/\[+(.*)[\]=]/g, (_, p1) => ':' + p1)
		.slice(1) || 'home') as App.RouteKey;

	const breadcrumbs: App.Route[] = [routingMap[lang].home];
	if (routingKey !== 'home') {
		const segments = routingKey.split('/');
		for (let i = 0; i < segments.length; i++) {
			const key = segments.slice(0, i + 1).join('/') as App.RouteKey;
			const route = routingMap[lang][key];
			if (route) {
				breadcrumbs.push(route);
			}
		}
	}

	return {
		editUrl: encodeURI(
			`https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/routes${route.id}/+page.svelte`,
		),
		sharedSettings: locals.sharedSettings,
		routing: {
			map: routingMap[lang],
			key: routingKey,
			breadcrumbs,
			paths: {
				vi: routingMap.vi[routingKey],
				en: routingMap.en[routingKey],
			},
		},
		meta: {
			og: {
				image: await getOgImagePath(route.id, lang),
			},
		},
	};
};
