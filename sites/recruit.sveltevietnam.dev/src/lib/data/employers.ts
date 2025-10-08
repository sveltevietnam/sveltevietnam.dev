import { getR2 } from '$lib/backend/utils';

export const IMAGE_CACHE_CONTROL = 'public, max-age=86400, must-revalidate';

export async function uploadEmployerImage(id: string, image: File) {
	const r2 = getR2();
	const imageUrl = getEmployerImagePath(id);
	await r2.put(getEmployerImagePath(id), await image.bytes(), {
		httpMetadata: {
			contentType: image.type,
			cacheControl: IMAGE_CACHE_CONTROL,
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
