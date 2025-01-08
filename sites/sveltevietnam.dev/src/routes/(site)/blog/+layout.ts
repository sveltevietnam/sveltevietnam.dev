import { loadLocale as loadBlogNewsletterLoacle } from '$lib/components/blog-newsletter/locales/generated';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent }) => {
	const parentLoadData = await parent();
	const blogNewsletterLocale = await loadBlogNewsletterLoacle(parentLoadData.sharedSettings.language);
	return {
		locales: {
			...parentLoadData.locales,
			blogNewsletter: blogNewsletterLocale,
		},
	};
}
