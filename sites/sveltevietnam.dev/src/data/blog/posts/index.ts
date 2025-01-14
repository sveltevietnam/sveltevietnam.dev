import type { Component } from 'svelte';
import type { Picture } from 'vite-imagetools';

import { loadBlogCategory, type BlogCategory, type BlogCategoryId } from '$data/blog/categories';
import { loadBlogSeries, type BlogSeries, type BlogSeriesId } from '$data/blog/series';
import { loadPerson, type Person, type PersonId } from '$data/people';

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
const contentModules = import.meta.glob<Component>('./*/content/*.md.svelte', {
	import: 'default',
});

export async function loadBlogPostMetadata(
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

export async function loadBlogPostContent(
	id: string,
	lang: App.Language,
): Promise<Component | null> {
	const path = `./${id}/content/${lang}.md.svelte`;
	if (!contentModules[path]) return null;
	return contentModules[path]();
}

async function extendBlogPostMetadata(
	metadata: BlogPostMetadata,
	lang: App.Language,
): Promise<ExtendedBlogPostMetadata> {
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
	const metadata = await loadBlogPostMetadata(id, lang);
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

export async function loadBlogPostBySlug(slug: string, lang: App.Language) {
	const metadatas = (await Promise.all(ids.map((id) => loadBlogPostMetadata(id, lang)))).filter(
		Boolean,
	);

	const matched = metadatas.find((metadata) => metadata.slug === slug);
	if (!matched) return null;
	return extendBlogPostMetadata(matched, lang);
}

type BlogPostSearchOptions = {
	lang: App.Language;
	where?: {
		categoryId?: string | string[];
		seriesId?: string | string[];
		authorId?: string | string[];
	};
	excludedIds?: string[];
	pagination?: { per: number; page: number };
};

type ExtendedBlogPostMetadata = Omit<BlogPostMetadata, 'authors' | 'categories' | 'series'> & {
	authors: Person[];
	categories: BlogCategory[];
	series: BlogSeries[];
	thumbnail?: Picture;
};

export async function search(options: BlogPostSearchOptions): Promise<{
	posts: ExtendedBlogPostMetadata[];
	total: number;
}> {
	const { lang, where, excludedIds, pagination } = options;

	const metadatas = (await Promise.all(ids.map((id) => loadBlogPostMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter((metadata) => {
		if (where) {
			const { categoryId, seriesId, authorId } = where;
			if (categoryId) {
				if (Array.isArray(categoryId)) {
					if (!categoryId.some((id) => metadata.categories?.includes(id))) return false;
				} else {
					if (!metadata.categories?.includes(categoryId)) return false;
				}
			}
			if (seriesId) {
				if (Array.isArray(seriesId)) {
					if (!seriesId.some((id) => metadata.series?.includes(id))) return false;
				} else {
					if (!metadata.series?.includes(seriesId)) return false;
				}
			}
			if (authorId) {
				if (Array.isArray(authorId)) {
					if (!authorId.some((id) => metadata.authors?.includes(id))) return false;
				} else {
					if (!metadata.authors?.includes(authorId)) return false;
				}
			}
		}
		if (excludedIds && excludedIds.includes(metadata.id)) return false;
		return true;
	});

	let paginated = matched;
	if (pagination) {
		const { per, page } = pagination;
		paginated = matched.slice(per * (page - 1), per * page);
	}

	const posts = await Promise.all(
		paginated.map((metadata) => extendBlogPostMetadata(metadata, lang)),
	);

	return {
		posts,
		total: matched.length,
	};
}

const MAX_IN_SERIES_COUNT = 3;
/**
 * Search for at most 3 posts in the same series with the following algorithm:
 * - 1 is the latest post in the same series, if any,
 * - 2 is the post that comes right after the target post that is not 1, if any.
 * In case none is found, switch to 3, if any.
 * - 3 is the post that comes right before the target post, if any. If same as 2, take the next one, if any.
 *
 * If multiple series, return an array of at most 3 posts for each series
 */
export async function searchPostsInSameSeries(lang: App.Language, postId: string, seriesIds: string[]): Promise<ExtendedBlogPostMetadata[]> {
	const posts = (await Promise.all(ids.map((id) => loadBlogPostMetadata(id, lang)))).filter(
		Boolean,
	);

	if (!seriesIds) return [];

	let remainingPosts = [...posts];
	let indexOfPost = remainingPosts.findIndex((p) => p.id === postId);
	if (indexOfPost === -1) return [];

	const postsInSameSeries: BlogPostMetadata[] = [];
	let matchedPosts: BlogPostMetadata[] = [];
	for (const series of seriesIds) {
		let left = indexOfPost - 1;
		let right = indexOfPost + 1;

		const leftBound = remainingPosts.findIndex((p) =>
			p.series?.some((s) => s === series),
		);
		if (leftBound !== -1) {
			const latestPostInSeries = remainingPosts[leftBound];
			if (latestPostInSeries.id !== postId) {
				matchedPosts.push(latestPostInSeries);
			}
		}

		while (left > leftBound || right < remainingPosts.length) {
			if (left > leftBound) {
				const leftPost = remainingPosts[left];
				if (leftPost?.series?.some((s) => s === series)) {
					matchedPosts.push(leftPost);
					if (matchedPosts.length >= MAX_IN_SERIES_COUNT) break;
				}
				left--;
			}

			if (right < remainingPosts.length) {
				const rightPost = remainingPosts[right];

				if (rightPost?.series?.some((s) => s === series)) {
					matchedPosts.push(rightPost);
					if (matchedPosts.length >= MAX_IN_SERIES_COUNT) break;
				}

				right++;
			}
		}

		if (matchedPosts.length) {
			postsInSameSeries.push(...matchedPosts);
			remainingPosts = remainingPosts.filter(
				(p) => !matchedPosts.some((_p) => _p.id === p.id),
			);
			indexOfPost = remainingPosts.findIndex((p) => p.id === postId);
			matchedPosts = [];
		}
	}

	return await Promise.all(postsInSameSeries.map((metadata) => extendBlogPostMetadata(metadata, lang)));
}
