import { error } from '@sveltejs/kit';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ url, platform, request, setHeaders }) => {
	const r2 = platform?.env?.r2;
	if (!r2) {
		error(500, { code: 'SV001', message: 'R2 not available' });
	}

	const object = await r2.get(url.pathname);
	if (!object) {
		return new Response(null, { status: 404 });
	}
	const requestEtag = request.headers.get('if-none-match');
	if (requestEtag && requestEtag === object.httpEtag) {
		return new Response(null, { status: 304 });
	}

	setHeaders({
		etag: object.httpEtag,
		'content-type': object.httpMetadata?.contentType || 'application/octet-stream',
		'cache-control': object.httpMetadata?.cacheControl || 'public, max-age=86400, immutable',
	});

	return new Response(object.body as BodyInit);
};
