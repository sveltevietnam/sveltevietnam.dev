import { LANGUAGES, localizeLangVar } from '@internals/utils/language';
import Mustache from 'mustache';

import { INTERNAL_POSTS } from '$lib/data/blog';
import { EVENTS } from '$lib/data/events';
import { ROUTE_MAP } from '$lib/routing/routing.map';

import type { RequestHandler } from './$types';
import template from './rss.template.xml?raw';

type RssItem = {
	title: string;
	description: string;
	link: string;
	guid: string;
	pubDate: string;
};

export const GET: RequestHandler = ({ url }) => {
	const items: RssItem[] = [
		...INTERNAL_POSTS.flatMap((p) =>
			LANGUAGES.map((l) => ({
				title: localizeLangVar(l, p.title),
				description: localizeLangVar(l, p.description),
				link: `${url.origin}${ROUTE_MAP.blog[l].path}/${localizeLangVar(l, p.slug)}`,
				guid: localizeLangVar(l, p.slug),
				pubDate: new Date(p.date).toUTCString(),
			})),
		),
		...EVENTS.flatMap((e) =>
			LANGUAGES.map((l) => ({
				title: localizeLangVar(l, e.title),
				description: localizeLangVar(l, e.description),
				link: `${url.origin}${ROUTE_MAP.events[l].path}/${localizeLangVar(l, e.slug)}`,
				guid: localizeLangVar(l, e.slug),
				pubDate: new Date(e.startDate).toUTCString(),
			})),
		),
	];
	const xml = Mustache.render(template, {
		title: 'Svelte Vietnam',
		link: url.origin,
		description: 'The go-to, one-stop information hub for the Svelte community in Vietnam',
		lastBuildDate: new Date(__BUILD_TIMESTAMP__).toUTCString(),
		copyright: `Copyright ${new Date().getFullYear()}, Svelte Vietnam`,
		items,
	});
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'application/xml',
	};
	return new Response(xml, { headers });
};
