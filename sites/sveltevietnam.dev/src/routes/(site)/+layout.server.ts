import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals, route, params }) => {
	return {
		editUrl: route.id
			? encodeURI(
					`https://github.com/sveltevietnam/sveltevietnam.dev/edit/main/sites/sveltevietnam.dev/src/routes${route.id}/+page.svelte`,
				)
			: undefined,
		settings: {
			language: params.lang || locals.language,
			colorScheme: locals.colorScheme,
			splash: locals.splash,
		},
	};
};
