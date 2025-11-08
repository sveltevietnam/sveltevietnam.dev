import { LANGUAGES } from '@sveltevietnam/kit/constants';
import { toW3CDate } from '@sveltevietnam/kit/utilities/datetime';
import Mustache from 'mustache';

import { listBlogCategories } from '$data/blog/categories';
import { listBlogPosts } from '$data/blog/posts';
import { listBlogSeries } from '$data/blog/series';
import { listEvents } from '$data/events';
import { listPeople } from '$data/people';
import * as p from '$data/routes/generated';
import { VITE_PUBLIC_ORIGIN } from '$env/static/public';

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

export const GET: RequestHandler = async ({ params }) => {
	const { lang } = params;
	const [
		{ posts: blogPosts },
		{ series: blogSeries },
		{ categories: blogCategories },
		{ events },
		{ people },
	] = await Promise.all([
		listBlogPosts({ lang, page: 1, per: 100 }),
		listBlogSeries({ lang, page: 1, per: 100 }),
		listBlogCategories({ lang, page: 1, per: 100 }),
		listEvents({ lang, page: 1, per: 100 }),
		listPeople({ lang, page: 1, per: 100 }),
	]);

	const urls: SiteMapUrl[] = [
		...[
			[p['/:lang'], 0.5] as const,
			[p['/:lang/blog'], 0.9] as const,
			[p['/:lang/blog/write'], 0.8] as const,
			[p['/:lang/blog/latest'], 0.7] as const,
			[p['/:lang/blog/series'], 0.6] as const,
			[p['/:lang/blog/categories'], 0.6] as const,
			[p['/:lang/events'], 0.8] as const,
			[p['/:lang/roadmap'], 0.6] as const,
			[p['/:lang/jobs'], 0.7] as const,
			[p['/:lang/people'], 0.5] as const,
			[p['/:lang/sponsor'], 0.6] as const,
			[p['/:lang/code-of-conduct'], 0.3] as const,
			[p['/:lang/settings'], 0.4] as const,
			[p['/:lang/design'], 0.2] as const,
		].flatMap(([path, priority]) => ({
			loc: VITE_PUBLIC_ORIGIN + path({ lang }),
			priority,
			alternates: LANGUAGES.map((l) => ({
				hreflang: l,
				href: VITE_PUBLIC_ORIGIN + path({ lang: l }),
			})),
		})),
		...events
			// exclude events hosted on external sites
			.filter((event) => !event.href.startsWith('http'))
			.map((event) => ({
				loc: VITE_PUBLIC_ORIGIN + p['/:lang/events/:slug']({ lang, slug: event.href }),
				...(event.startDate instanceof Date && {
					lastmod: toW3CDate(event.startDate),
				}),
				priority: 0.9,
				alternates: LANGUAGES.map((l) => ({
					hreflang: l,
					href: VITE_PUBLIC_ORIGIN + p['/:lang/events/:slug']({ lang: l, slug: event.href }),
				})),
			})),
		...blogPosts.map((post) => ({
			loc: VITE_PUBLIC_ORIGIN + p['/:lang/blog/:slug']({ lang, slug: post.slug }),
			lastmod: toW3CDate(post.updatedAt || post.publishedAt),
			priority: 0.8,
			alternates: LANGUAGES.map((l) => ({
				hreflang: l,
				href: VITE_PUBLIC_ORIGIN + p['/:lang/blog/:slug']({ lang: l, slug: post.slug }),
			})),
		})),
		...blogSeries.map((series) => ({
			loc: VITE_PUBLIC_ORIGIN + p['/:lang/blog/series/:slug']({ lang, slug: series.slug }),
			priority: 0.6,
			alternates: LANGUAGES.map((l) => ({
				hreflang: l,
				href: VITE_PUBLIC_ORIGIN + p['/:lang/blog/series/:slug']({ lang: l, slug: series.slug }),
			})),
		})),
		...blogCategories.map((category) => ({
			loc: VITE_PUBLIC_ORIGIN + p['/:lang/blog/categories/:slug']({ lang, slug: category.slug }),
			priority: 0.6,
			alternates: LANGUAGES.map((l) => ({
				hreflang: l,
				href:
					VITE_PUBLIC_ORIGIN + p['/:lang/blog/categories/:slug']({ lang: l, slug: category.slug }),
			})),
		})),
		...people.map((person) => ({
			loc: VITE_PUBLIC_ORIGIN + p['/:lang/people/:id']({ lang, id: person.id }),
			priority: 0.5,
			alternates: LANGUAGES.map((l) => ({
				hreflang: l,
				href: VITE_PUBLIC_ORIGIN + p['/:lang/people/:id']({ lang: l, id: person.id }),
			})),
		})),
	];

	const xml = Mustache.render(template, { urls });
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml',
	};
	return new Response(xml, { headers });
};
