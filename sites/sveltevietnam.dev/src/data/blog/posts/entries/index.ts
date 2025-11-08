import type { Language } from '@sveltevietnam/kit/constants';
import type { Component } from 'svelte';
import type { Picture } from 'vite-imagetools';

import { loadBlogCategory } from '$data/blog/categories/entries';
import { loadBlogSeries } from '$data/blog/series/entries';
import { loadPerson } from '$data/people/entries';

import type * as t from '../types';

export function defineBlogPostMetadata(
	def: t.BlogPostMetadataDefinition,
): t.BlogPostMetadataDefinition {
	return def;
}

const metadataModules = import.meta.glob<t.BlogPostMetadataDefinition>('./*/metadata.ts', {
	import: 'default',
});
const thumbnailModules = import.meta.glob<Picture>('./*/images/thumbnail.jpg', {
	import: 'default',
	query: '?enhanced&w=2240;1540;1088;686',
});
const ogImageModules = import.meta.glob<string>('./*/images/thumbnail.jpg', {
	import: 'default',
	query: '?h=800',
});
const contentModules = import.meta.glob<Component>('./*/content/*.md.svelte', {
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
				return [
					{ lang: 'en', slug: def('en').slug.toString() },
					{ lang: 'vi', slug: def('vi').slug.toString() },
				];
			}),
		)
	)
		.flat()
		.filter(Boolean);
}

export async function loadBlogPostMetadata(
	id: string,
	lang: Language,
): Promise<t.BlogPostMetadata | null> {
	const path = `./${id}/metadata.ts`;
	if (!metadataModules[path]) return null;
	const def = await metadataModules[path]();
	return {
		...def(lang),
		id,
	};
}

export async function loadBlogPostThumbnail(id: string): Promise<Picture | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!thumbnailModules[path]) return undefined;
	return thumbnailModules[path]();
}

export async function loadBlogPostOgImage(id: string): Promise<string | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!ogImageModules[path]) return undefined;
	return ogImageModules[path]();
}

export async function loadBlogPostContent(id: string, lang: Language): Promise<Component | null> {
	const path = `./${id}/content/${lang}.md.svelte`;
	if (!contentModules[path]) return null;
	return contentModules[path]();
}

export async function extendBlogPostMetadata(
	metadata: t.BlogPostMetadata,
	lang: Language,
): Promise<t.ExtendedBlogPostMetadata> {
	const id = metadata.id;
	const [authors, categories, series, thumbnail] = await Promise.all([
		Promise.all((metadata.authors ?? []).map((id) => loadPerson(id, lang))),
		Promise.all((metadata.categories ?? []).map((id) => loadBlogCategory(id, lang))),
		Promise.all((metadata.series ?? []).map((id) => loadBlogSeries(id, lang))),
		metadata.thumbnail ?? loadBlogPostThumbnail(id),
	]);

	return {
		...metadata,
		authors: authors.filter(Boolean),
		categories: categories.filter(Boolean),
		series: series.filter(Boolean),
		thumbnail,
	};
}
