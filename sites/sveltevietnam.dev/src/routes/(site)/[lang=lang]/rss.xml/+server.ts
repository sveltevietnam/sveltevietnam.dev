import Mustache from 'mustache';

import { loadBlogPosts } from '$data/blog/posts';
import { loadEvents } from '$data/events';
import * as m from '$data/locales/generated/messages';
import * as p from '$data/routes/generated';

import type { RequestHandler } from './$types';
import template from './rss.template.xml?raw';

type RssItem = {
	title: string;
	description: string;
	link: string;
	guid: string;
	pubDate: string;
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
		loadEvents(lang, 1, 100),
		loadBlogPosts(lang, 1, 100),
	]);

	const items: RssItem[] = [
		...events.map((event) => ({
			title: event.title,
			description: event.description,
			link: origin + p['/:lang/events/:slug']({ lang, slug: event.slug }),
			guid: `tag:sveltevietnam.dev,${event.startDate.getFullYear()}:event.${event.slug}`,
			pubDate: new Date(event.startDate).toUTCString(),
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
		title: m['svelte_vietnam.name'](lang).toString(),
		link: origin + p['/:lang']({ lang }),
		lang,
		description: m['rss.desc'](lang).toString(),
		lastBuildDate: new Date(__BUILD_TIMESTAMP__).toUTCString(),
		copyright: m['rss.copyright'](lang)({ year: new Date().getFullYear().toString() }).toString(),
		image: {
			url: `${origin}/logo/rss.png`,
			title: m['svelte_vietnam.name'](lang).toString(),
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
