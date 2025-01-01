import { loadLocale as loadFooterLocale } from '$lib/components/footer/locales/generated';
import { loadLocale as loadHeaderLocale } from '$lib/components/header/locales/generated';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import { getPageLocaleModule } from '$routes/loaders';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, route }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const pageLocales = await getPageLocaleModule(route.id, data.sharedSettings.language);
	const [footer, header] = await Promise.all([
		loadFooterLocale(data.sharedSettings.language),
		loadHeaderLocale(data.sharedSettings.language),
	]);
	return {
		...data,
		locales: {
			footer,
			header,
			page: pageLocales,
		},
		meta: {
			...data.meta,
			title: pageLocales?.page_title?.toString(),
			keywords: pageLocales?.page_keywords?.toString(),
			description: pageLocales?.page_description?.toString(),
			og: {
				...data.meta.og,
			},
		},
	};
};
