import type { Language } from '@sveltevietnam/kit/constants';
import type { Component } from 'svelte';
import type { Picture } from 'vite-imagetools';

import type * as t from '../types';

export function defineEventMetadata(def: t.EventMetadataDefinition): t.EventMetadataDefinition {
	return def;
}

export function defineEventAdditionalStructuredData(
	def: t.EventAdditionalStructuredDataDefinition,
): t.EventAdditionalStructuredDataDefinition {
	return def;
}

const metadataModules = import.meta.glob<t.EventMetadataDefinition>('./*/metadata.ts', {
	import: 'default',
});
const additionalStructuredDataModules =
	import.meta.glob<t.EventAdditionalStructuredDataDefinition | null>(
		'./*/additionalStructuredData.ts',
		{
			import: 'structured',
		},
	);
const thumbnailModules = import.meta.glob<Picture>('./*/images/thumbnail.jpg', {
	import: 'default',
	query: '?enhanced&w=1200;700;400',
});
const ogImageModules = import.meta.glob<string>('./*/images/og.jpg', {
	import: 'default',
});
const contentModules = import.meta.glob<Component>('./*/content.svelte', {
	import: 'default',
});

export const ids = Object.keys(metadataModules)
	.map((path) => path.split('/')[1])
	.sort((a, b) => (a > b ? -1 : 1));

export async function generateKitEntries(): Promise<{ lang: Language; slug: string }[]> {
	return (
		await Promise.all(
			ids.map(async (id) => {
				const path = `./${id}/metadata.ts`;
				if (!metadataModules[path]) return null;
				const def = await metadataModules[path]();
				if (def('en').href.startsWith('http') || def('vi').href.startsWith('http')) return null;
				return [
					{ lang: 'en', slug: def('en').href.toString() },
					{ lang: 'vi', slug: def('vi').href.toString() },
				];
			}),
		)
	)
		.flat()
		.filter(Boolean);
}

export async function loadEventMetadata(
	id: string,
	lang: Language,
	optionalModules?: Partial<t.EventOptionalModules> | true,
): Promise<t.EventMetadata | null> {
	const path = `./${id}/metadata.ts`;
	if (!metadataModules[path]) return null;
	const def = await metadataModules[path]();
	const event = def(lang);

	// eslint-disable-next-line prefer-const
	let { thumbnail, ogImage, ...rest } = event;
	[thumbnail, ogImage] = await Promise.all([
		optionalModules === true || optionalModules?.thumbnail
			? thumbnail
				? thumbnail
				: loadEventThumbnail(id)
			: undefined,
		optionalModules === true || optionalModules?.ogImage
			? ogImage
				? ogImage
				: loadEventOgImage(id)
			: undefined,
	]);

	return {
		...rest,
		id,
		thumbnail,
		ogImage,
	};
}

export async function loadEventThumbnail(id: string): Promise<Picture | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!thumbnailModules[path]) return undefined;
	return thumbnailModules[path]();
}

export async function loadEventOgImage(id: string): Promise<string | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!ogImageModules[path]) return undefined;
	return ogImageModules[path]();
}

export async function loadEventContent(id: string): Promise<Component | null> {
	const path = `./${id}/content.svelte`;
	if (!contentModules[path]) return null;
	return contentModules[path]();
}

export async function loadEventAdditionalStructuredData(
	id: string,
	lang: Language,
	origin: string,
): Promise<t.EventAdditionalStructuredData | null> {
	const path = `./${id}/additionalStructuredData.ts`;
	if (!additionalStructuredDataModules[path]) return null;
	const def = await additionalStructuredDataModules[path]();
	if (!def) return null;
	return def(lang, origin);
}
