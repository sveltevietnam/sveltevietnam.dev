import en from '$data/routing/en.generated.json';
import vi from '$data/routing/vi.generated.json';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const routingMap = locals.sharedSettings.language === 'vi' ? vi : en;
	const routingKey = (route.id
		// remove layout group (...)
		.replace(/\/\(.*\)/g, '')
		// replace [[param=...]] with :param
		.replace(/\[+(.*)[\]=]/g, (_, p1) => ':' + p1)
		.slice(1) || 'home') as App.RouteKey;

	const breadcrumbs: App.Route[] = [routingMap.home];
	for (const key of routingKey.split('/')) {
		const route = routingMap[key as App.RouteKey];
		if (route) {
			breadcrumbs.push(route);
		}
	}

	return {
		sharedSettings: locals.sharedSettings,
		routing: {
			map: routingMap,
			key: routingKey,
			breadcrumbs,
			paths: {
				vi: vi[routingKey],
				en: en[routingKey],
			},
		},
	};
};
