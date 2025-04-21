import type { LayoutServerLoad } from './$types';

export const prerender = true;

export const load: LayoutServerLoad = async ({ locals, route, params }) => {
	return {
		editUrl: route.id
			? encodeURI(
					`https://github.com/sveltevietnam/sveltevietnam.dev/edit/v1/sites/sveltevietnam.dev/src/routes${route.id}/+page.svelte`,
				)
			: undefined,
		language: params.lang || locals.language,
	};
};
