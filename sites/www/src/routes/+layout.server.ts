import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = ({ url, locals }) => {
	return {
		pathname: url.pathname, // to trigger when pathname changes
		colorScheme: locals.colorScheme,
		supportedLanguages: ['en', 'vi'],
		language: locals.language,
	};
};
