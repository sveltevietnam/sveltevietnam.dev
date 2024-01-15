/** https://www.sitemaps.org/protocol.html */

import { LANGUAGES, localizeLangVar } from '@internals/utils/language';
import Mustache from 'mustache';

import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';
import { ROUTE_MAP } from '$lib/routing/routing.map';
import { toW3CDate } from '$lib/utils/datetime';

import type { RequestHandler } from './$types';
import template from './sitemap.template.xml?raw';

/** https://www.sitemaps.org/protocol.html */
type SiteMapUrl = {
	loc: string;
	lastmod?: string;
	changefreq?: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';
	priority?: number;
	alternates?: Array<{
		hreflang: string;
		href: string;
	}>;
};

export const GET: RequestHandler = ({ url }) => {
	const urls = [
		...INTERNAL_POSTS.flatMap((p) =>
			LANGUAGES.map(
				(l) =>
					({
						loc: url.origin + ROUTE_MAP.blog[l].path + `/${localizeLangVar(l, p.slug)}`,
						lastmod: toW3CDate(new Date(p.date)),
						priority: 0.8,
						alternates: LANGUAGES.map((l) => ({
							hreflang: l,
							href: url.origin + ROUTE_MAP.blog[l].path + `/${localizeLangVar(l, p.slug)}`,
						})),
					}) satisfies SiteMapUrl,
			),
		),
		...EVENTS.flatMap((e) =>
			LANGUAGES.map(
				(l) =>
					({
						loc: url.origin + ROUTE_MAP.events[l].path + `/${localizeLangVar(l, e.slug)}`,
						lastmod: toW3CDate(new Date(e.endDate ?? e.startDate)),
						priority: 0.7,
						alternates: LANGUAGES.map((l) => ({
							hreflang: l,
							href: url.origin + ROUTE_MAP.events[l].path + `/${localizeLangVar(l, e.slug)}`,
						})),
					}) satisfies SiteMapUrl,
			),
		),
		...[
			[ROUTE_MAP.home, 0.5] as const,
			[ROUTE_MAP.blog, 0.9] as const,
			[ROUTE_MAP.events, 0.8] as const,
			[ROUTE_MAP.roadmap, 0.6] as const,
			[ROUTE_MAP.jobs, 0.7] as const,
			// [ROUTE_MAP.impact, 0.6] as const,
			// [ROUTE_MAP.people, 0.5] as const,
			[ROUTE_MAP.sponsor, 0.6] as const,
			[ROUTE_MAP.codeOfConduct, 0.3] as const,
			[ROUTE_MAP.design, 0.2] as const,
			[ROUTE_MAP.design_typography, 0.2] as const,
			[ROUTE_MAP.design_colors, 0.2] as const,
			[ROUTE_MAP.design_blog, 0.2] as const,
		].flatMap(([route, priority]) =>
			LANGUAGES.map(
				(l) =>
					({
						loc: url.origin + route[l].path,
						priority,
						alternates: LANGUAGES.map((l) => ({
							hreflang: l,
							href: url.origin + route[l].path,
						})),
					}) satisfies SiteMapUrl,
			),
		),
	] satisfies SiteMapUrl[];

	const xml = Mustache.render(template, { urls });
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml',
	};
	return new Response(xml, { headers });
};
