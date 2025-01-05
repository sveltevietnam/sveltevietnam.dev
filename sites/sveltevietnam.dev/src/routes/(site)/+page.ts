import type { PageLoad } from './$types';
import { loadLocale as loadSectionBlogLocale } from './_page/sections/blog/locales/generated';
import { loadLocale as loadSectionEventsLocale } from './_page/sections/events/locales/generated';
import { loadLocale as loadSectionIntroLocale } from './_page/sections/intro/locales/generated';
import { loadLocale as loadSectionResourcesLocale } from './_page/sections/resources/locales/generated';
import { loadLocale as loadSectionSponsorLocale } from './_page/sections/sponsor/locales/generated';

export const load: PageLoad = async ({ parent }) => {
	const data = await parent();
	const [sectionIntro, sectionResources, sectionEvents, sectionBlog, sectionSponsor] =
		await Promise.all([
			loadSectionIntroLocale(data.sharedSettings.language),
			loadSectionResourcesLocale(data.sharedSettings.language),
			loadSectionEventsLocale(data.sharedSettings.language),
			loadSectionBlogLocale(data.sharedSettings.language),
			loadSectionSponsorLocale(data.sharedSettings.language),
		]);
	return {
		...data,
		locales: {
			...data.locales,
			sectionIntro,
			sectionResources,
			sectionEvents,
			sectionBlog,
			sectionSponsor,
		},
	};
};
