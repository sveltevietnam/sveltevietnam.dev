import { loadLocale as loadColorSchemeMenuLocale } from '$lib/components/color-scheme-menu/locales/generated';
import { loadLocale as loadFooterLocale } from '$lib/components/footer/locales/generated';
import { loadLocale as loadGreenWebBadgeLocale } from '$lib/components/green-web-badge/locales/generated';
import { loadLocale as loadHeaderLocale } from '$lib/components/header/locales/generated';
import { loadLocale as loadLanguageMenuLocale } from '$lib/components/language-menu/locales/generated';
import { loadLocale as loadNotByAiBadgeLocale } from '$lib/components/not-by-ai-badge/locales/generated';
import { loadLocale as loadPageEditLinkLocale } from '$lib/components/page-edit-link/locales/generated';
import { loadLocale as loadPageMenuLocale } from '$lib/components/page-menu/locales/generated';
import { loadLocale as loadPaginationLocale } from '$lib/components/pagination/locales/generated';
import { LOAD_DEPENDENCIES } from '$lib/constants';
import type { PageMetadata } from '$lib/meta';
import { getPageLocaleModule } from '$routes/loaders';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends, route }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	const pageLocales = await getPageLocaleModule(route.id, data.sharedSettings.language);
	const [
		header,
		languageMenu,
		colorSchemeMenu,
		pageMenu,
		pagination,
		footer,
		greenWebBadge,
		notByAiBadge,
		edit,
	] = await Promise.all([
		loadHeaderLocale(data.sharedSettings.language),
		loadLanguageMenuLocale(data.sharedSettings.language),
		loadColorSchemeMenuLocale(data.sharedSettings.language),
		loadPageMenuLocale(data.sharedSettings.language),
		loadPaginationLocale(data.sharedSettings.language),
		loadFooterLocale(data.sharedSettings.language),
		loadGreenWebBadgeLocale(data.sharedSettings.language),
		loadNotByAiBadgeLocale(data.sharedSettings.language),
		loadPageEditLinkLocale(data.sharedSettings.language),
	]);
	return {
		...data,
		locales: {
			header,
			languageMenu,
			colorSchemeMenu,
			pageMenu,
			pagination,
			footer,
			greenWebBadge,
			notByAiBadge,
			edit,
			page: pageLocales,
		},
		meta: {
			...data.meta,
			title: (data.meta as PageMetadata)?.title ?? pageLocales?.page_title?.toString(),
			keywords: (data.meta as PageMetadata)?.keywords ?? pageLocales?.page_keywords?.toString(),
			description:
				(data.meta as PageMetadata)?.description ?? pageLocales?.page_description?.toString(),
		},
	};
};
