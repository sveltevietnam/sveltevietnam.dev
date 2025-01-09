import type { Picture } from 'vite-imagetools';

import { loadBlogCategory, type BlogCategoryId } from '$data/blog/categories';
import { loadBlogSeries, type BlogSeriesId } from '$data/blog/series';
import { loadPerson, type PersonId } from '$data/people';

import ids from './ids';

export { default as ids } from './ids';

export type BlogPostMetadata = {
	id: string;
	slug: string;
	title: string;
	description: string;
	authors: PersonId[];
	publishedAt: Date;
	series?: BlogSeriesId[];
	categories?: BlogCategoryId[];
	/**
	 * indicate whether the blog post is
	 * in original language or has been translated
	 * @default 'original'
	 */
	translation?: 'original' | 'manual';
	/**
	 * indicate the use of AI in authoring
	 * in any form (assets, content, translation, ...)
	 * @default false
	 */
	ai?: boolean;
	/**
	 * estimated number of words in the blog post contnet
	 */
	numWords?: number;
	/**
	 * estimated number of minutes to read the blog post
	 */
	readMinutes?: number;
	/**
	 * enhanced image definition to display in listing
	 * and also as cover image on detail post page
	 */
	thumbnail?: Picture;
	/**
	 * comma-separated list of keywords for SEO
	 */
	keywords?: string;
};

export function defineBlogPostMetadata(
	metadata: Omit<BlogPostMetadata, 'id'>,
): Omit<BlogPostMetadata, 'id'> {
	return metadata;
}

type BlogPostMetadataModule =
	| {
			default: Omit<BlogPostMetadata, 'id'>;
	  }
	| {
			en: Omit<BlogPostMetadata, 'id'>;
			vi: Omit<BlogPostMetadata, 'id'>;
	  };

const metadataModules = import.meta.glob<BlogPostMetadataModule>('./*/metadata.ts');
const thumbnailModules = import.meta.glob<Picture>('./*/images/thumbnail.jpg', {
	import: 'default',
	query: '?enhanced&w=2240,1540;1088;686',
});

export async function loadBlogMetadata(
	id: string,
	lang: App.Language,
): Promise<BlogPostMetadata | null> {
	const path = `./${id}/metadata.ts`;
	if (!metadataModules[path]) return null;
	const module = await metadataModules[path]();
	let metadata: Omit<BlogPostMetadata, 'id'>;
	if ('en' in module) {
		metadata = module[lang];
	} else {
		metadata = module.default;
	}
	return {
		...metadata,
		id,
	};
}

export async function loadBlogThumbnail(id: string): Promise<Picture | undefined> {
	const path = `./${id}/images/thumbnail.jpg`;
	if (!thumbnailModules[path]) return undefined;
	return thumbnailModules[path]();
}

async function extendBlogPostMetadata(metadata: BlogPostMetadata, lang: App.Language) {
	const id = metadata.id;
	const [authors, categories, series, thumbnail] = await Promise.all([
		Promise.all((metadata.authors ?? []).map((id) => loadPerson(id, lang))),
		Promise.all((metadata.categories ?? []).map((id) => loadBlogCategory(id, lang))),
		Promise.all((metadata.series ?? []).map((id) => loadBlogSeries(id, lang))),
		metadata.thumbnail ?? loadBlogThumbnail(id),
	]);

	return {
		...metadata,
		authors: authors.filter(Boolean),
		categories: categories.filter(Boolean),
		series: series.filter(Boolean),
		thumbnail,
	};
}

export async function loadBlogPost(id: string, lang: App.Language) {
	const metadata = await loadBlogMetadata(id, lang);
	if (!metadata) return null;
	return extendBlogPostMetadata(metadata, lang);
}

export async function loadBlogPosts(lang: App.Language, page: number, per: number) {
	return {
		posts: (
			await Promise.all(ids.slice(per * (page - 1), per * page).map((id) => loadBlogPost(id, lang)))
		).filter(Boolean),
		total: ids.length,
	};
}

export async function loadBlogPostsByCategory(
	categoryId: string,
	lang: App.Language,
	page: number,
	per: number,
	excludedIds: string[] = [],
) {
	const metadatas = (await Promise.all(ids.map((id) => loadBlogMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter(
		(metadata) => metadata.categories?.includes(categoryId) && !excludedIds.includes(metadata.id),
	);
	const paginated = matched.slice(per * (page - 1), per * page);
	const posts = await Promise.all(
		paginated.map((metadata) => extendBlogPostMetadata(metadata, lang)),
	);
	return {
		posts,
		total: matched.length,
	};
}

export async function loadBlogPostsBySeries(
	seriesId: string,
	lang: App.Language,
	page: number,
	per: number,
) {
	const metadatas = (await Promise.all(ids.map((id) => loadBlogMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter((metadata) => metadata.series?.includes(seriesId));
	const paginated = matched.slice(per * (page - 1), per * page);
	const posts = await Promise.all(
		paginated.map((metadata) => extendBlogPostMetadata(metadata, lang)),
	);
	return {
		posts,
		total: matched.length,
	};
}

export async function loadBlogPostsByAuthor(
	authorId: string,
	lang: App.Language,
	page: number,
	per: number,
) {
	const metadatas = (await Promise.all(ids.map((id) => loadBlogMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter((metadata) => metadata.authors?.includes(authorId));
	const paginated = matched.slice(per * (page - 1), per * page);
	const posts = await Promise.all(
		paginated.map((metadata) => extendBlogPostMetadata(metadata, lang)),
	);
	return {
		posts,
		total: matched.length,
	};
}
