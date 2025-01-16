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
import { loadLocale as loadDiscordNewMessageLocale } from '$lib/notifications/components/discord-new-message/locales/generated';
import { getPageLocaleModule } from '$routes/loaders';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ parent, depends, route }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	const parentLoadData = await parent();
	const lang = parentLoadData.sharedSettings.language;

	const [
		page,
		header,
		languageMenu,
		colorSchemeMenu,
		pageMenu,
		pagination,
		footer,
		greenWebBadge,
		notByAiBadge,
		edit,
		discordNewMessage,
	] = await Promise.all([
		getPageLocaleModule(route.id, lang),
		loadHeaderLocale(lang),
		loadLanguageMenuLocale(lang),
		loadColorSchemeMenuLocale(lang),
		loadPageMenuLocale(lang),
		loadPaginationLocale(lang),
		loadFooterLocale(lang),
		loadGreenWebBadgeLocale(lang),
		loadNotByAiBadgeLocale(lang),
		loadPageEditLinkLocale(lang),
		loadDiscordNewMessageLocale(lang),
	]);
	return {
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
			discordNewMessage,
			page,
		},
		meta: {
			...parentLoadData.meta,
			title: (parentLoadData.meta as PageMetadata)?.title ?? page?.page_title?.toString(),
			keywords:
				(parentLoadData.meta as PageMetadata)?.keywords ?? page?.page_keywords?.toString(),
			description:
				(parentLoadData.meta as PageMetadata)?.description ??
				page?.page_description?.toString(),
		},
	};
};
