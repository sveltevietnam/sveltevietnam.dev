/**
 * https://securitytxt.org/
 */
import Mustache from 'mustache';

import template from './security.template.txt?raw';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const expiresAt = new Date(`${new Date().getFullYear()}-12-31T23:59:59.999Z`);
	const txt = Mustache.render(template, {
		expires_at: expiresAt.toISOString(),
	});
	const headers = {
		'Cache-Control': 'max-age=0, s-maxage=3600',
		'Content-Type': 'text/plain',
	};
	return new Response(txt, { headers });
};
