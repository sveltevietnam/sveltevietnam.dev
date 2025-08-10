import { resolve } from '$app/paths';

import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, params, route }) => {
	return {
		paths: {
			en: resolve(route.id, { ...params, lang: 'en' } as Parameters<typeof resolve>[1]),
			vi: resolve(route.id, { ...params, lang: 'vi' } as Parameters<typeof resolve>[1]),
		},
		settings: {
			language: params.lang || locals.language,
			colorScheme: locals.colorScheme,
		},
	};
};
