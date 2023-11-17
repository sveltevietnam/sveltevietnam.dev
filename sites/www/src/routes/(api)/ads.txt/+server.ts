/**
 * https://humanstxt.org/
 */
import Mustache from 'mustache';

import type { RequestHandler } from './$types';
import template from './ads.template.txt?raw';

export const GET: RequestHandler = async () => {
	const txt = Mustache.render(template, {});
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'text/plain',
	};
	return new Response(txt, { headers });
};
