import { LANGUAGES } from '@internals/utils/language';
import { delocalizeUrl } from '@internals/utils/url';

export const SITEMAP_PATH = '/sitemap.xml';
export const RSS_PATH = '/rss.xml';

export const HOME_PATH = '/';
export const BLOG_PATH = '/blog';
export const EVENTS_PATH = '/events';
export const JOBS_PATH = '/jobs';
export const IMPACT_PATH = '/impact';
export const PEOPLE_PATH = '/people';
export const SPONSOR_PATH = '/sponsor';
export const CODE_OF_CONDUCT_PATH = '/code-of-conduct';
export const ROADMAP_PATH = '/roadmap';
export const DESIGN_PATH = '/design';
export const DESIGN_TYPOGRAPHY_PATH = '/design/typography';
export const DESIGN_COLORS_PATH = '/design/colors';
export const DESIGN_BLOG_PATH = '/design/blog';

export const HEADER_PATHS = [
	EVENTS_PATH,
	BLOG_PATH,
	JOBS_PATH,
	// IMPACT_PATH,
	// PEOPLE_PATH,
	SPONSOR_PATH,
];
export const FOOTER_PATHS = [
	HOME_PATH,
	BLOG_PATH,
	EVENTS_PATH,
	JOBS_PATH,
	// IMPACT_PATH,
	// PEOPLE_PATH,
	SPONSOR_PATH,
	ROADMAP_PATH,
	DESIGN_PATH,
];
export const ALL_PATHS = [
	HOME_PATH,
	BLOG_PATH,
	EVENTS_PATH,
	JOBS_PATH,
	// IMPACT_PATH,
	// PEOPLE_PATH,
	SPONSOR_PATH,
	CODE_OF_CONDUCT_PATH,
	ROADMAP_PATH,
	DESIGN_PATH,
	DESIGN_TYPOGRAPHY_PATH,
	DESIGN_COLORS_PATH,
];

export function isCurrentPage(pathname: string, href: string) {
	const delocalizedPathname = delocalizeUrl(pathname, LANGUAGES);
	const delocalizedHref = delocalizeUrl(href, LANGUAGES);
	if (delocalizedHref === HOME_PATH) {
		return delocalizedPathname === href;
	}
	return delocalizedPathname.startsWith(href);
}

export type Breadcrumb = {
	label: string;
	href?: string;
};
