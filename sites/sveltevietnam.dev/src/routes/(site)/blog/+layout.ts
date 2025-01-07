import { loadLocale as loadBlogNewsletterLoacle } from '$lib/components/blog-newsletter/locales/generated';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const data = await parent();
	const blogNewsletterLocale = await loadBlogNewsletterLoacle(data.sharedSettings.language);
	return {
		...data,
		locales: {
			...data.locales,
			blogNewsletter: blogNewsletterLocale,
		},
	};
}
