import { getR2 } from '$lib/backend/utils';

export async function uploadEmployerImage(id: string, image: File) {
	const r2 = getR2();
	const imageUrl = getEmployerImagePath(id);
	await r2.put(getEmployerImagePath(id), await image.bytes(), {
		httpMetadata: {
			contentType: image.type,
			cacheControl: 'public, max-age=86400, immutable',
		},
	});
	return imageUrl;
}

export async function getEmployerImage(id: string) {
	const r2 = getR2();
	return await r2.get(getEmployerImagePath(id));
}

export function getEmployerImagePath(employerId: string) {
	return `/employers/${employerId}/image`;
}
