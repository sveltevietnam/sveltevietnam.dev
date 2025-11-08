import * as m from '@sveltevietnam/i18n/generated/messages';
import Mustache from 'mustache';

import { listBlogPosts } from '$data/blog/posts';
import { listEvents } from '$data/events';
import * as p from '$data/routes/generated';

import type { RequestHandler } from './$types';
import template from './rss.template.xml?raw';

type RssItem = {
	title: string;
	description: string;
	link: string;
	guid: string;
	pubDate?: string;
	creators?: string;
	categories?: {
		domain: string;
		name: string;
	}[];
	image?: {
		url: string;
		width: number;
		height: number;
	};
};

export const GET: RequestHandler = async ({ params, url }) => {
	const { lang } = params;
	const origin = url.origin;

	const [{ events }, { posts }] = await Promise.all([
		listEvents({ lang, per: 10, page: 1, optionalModules: { thumbnail: true } }),
		listBlogPosts({ lang, page: 1, per: 100 }),
	]);

	const items: RssItem[] = [
		...events.map((event) => ({
			title: event.title,
			description: event.description,
			link: event.href.startsWith('http')
				? event.href
				: origin + p['/:lang/events/:slug']({ lang, slug: event.href }),
			guid: `tag:sveltevietnam.dev:event.${event.href}`,
			...(event.startDate && {
				pubDate: new Date(event.startDate).toUTCString(),
			}),
			...(event.thumbnail && {
				image: {
					url: origin + event.thumbnail.img.src,
					width: event.thumbnail.img.w,
					height: event.thumbnail.img.h,
				},
			}),
		})),
		...posts.map((post) => ({
			title: post.title,
			description: post.description,
			link: origin + p['/:lang/blog/:slug']({ lang, slug: post.slug }),
			guid: `tag:sveltevietnam.dev,${post.publishedAt.getFullYear()}:post.${post.slug}`,
			pubDate: new Date(post.publishedAt).toUTCString(),
			creators: post.authors.map((author) => author.name).join(', '),
			categories: post.categories.map((category) => ({
				domain:
					origin +
					p['/:lang/blog/categories/:slug']({
						lang,
						slug: category.slug,
					}),
				name: category.name,
			})),
			...(post.thumbnail && {
				image: {
					url: origin + post.thumbnail.img.src,
					width: post.thumbnail.img.w,
					height: post.thumbnail.img.h,
				},
			}),
		})),
	];

	const xml = Mustache.render(template, {
		title: m['svelte_vietnam.name'](lang),
		link: origin + p['/:lang']({ lang }),
		lang,
		description: m['pages.rss.desc'](lang),
		lastBuildDate: new Date(__BUILD_TIMESTAMP__).toUTCString(),
		copyright: m['pages.rss.copyright'](lang, { year: new Date().getFullYear().toString() }),
		image: {
			url: `${origin}/logo/rss.png`,
			title: m['svelte_vietnam.name'](lang),
			width: 144,
			height: 144,
		},
		items,
	});
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml',
	};
	return new Response(xml, { headers });
};
