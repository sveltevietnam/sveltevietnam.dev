import { getEmployerImage, IMAGE_CACHE_CONTROL } from '$lib/data/employers';

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
		ETag: image.httpEtag,
		'Content-Type': image.httpMetadata?.contentType || 'application/octet-stream',
		'Cache-Control': image.httpMetadata?.cacheControl || IMAGE_CACHE_CONTROL,
	});

	return new Response(image.body as BodyInit);
};
