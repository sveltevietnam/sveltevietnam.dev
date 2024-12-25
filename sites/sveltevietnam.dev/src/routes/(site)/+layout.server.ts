import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async ({ locals }) => {
	return {
		sharedSettings: locals.sharedSettings,
		language: locals.language,
	};
};
