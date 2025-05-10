import type { PageLoad } from './$types';
import en from './_page/content/en.md.svelte';
import vi from './_page/content/vi.md.svelte';

export const load: PageLoad = async ({ params, data }) => {
	const { lang } = params;

	return {
		...data,
		content: lang === 'en' ? en : vi,
	};
};
