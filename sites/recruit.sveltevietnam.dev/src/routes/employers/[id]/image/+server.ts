import { getEmployerImage } from '$lib/data/employers';

import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ params, request, setHeaders }) => {
	const image = await getEmployerImage(params.id);
	if (!image) {
		return new Response(null, { status: 404 });
	}
	const requestEtag = request.headers.get('if-none-match');
	if (requestEtag && requestEtag === image.httpEtag) {
		return new Response(null, { status: 304 });
	}

	setHeaders({
		etag: image.httpEtag,
		'content-type': image.httpMetadata?.contentType || 'application/octet-stream',
		'cache-control': image.httpMetadata?.cacheControl || 'public, max-age=86400, immutable',
	});

	return new Response(image.body as BodyInit);
};
