import type { Picture } from 'vite-imagetools';

import type { BlogCategory } from '$data/blog/categories';
import type { BlogSeries } from '$data/blog/series';
import type { Person } from '$data/people';

export type BlogPostMetadata = {
	id: string;
	slug: string;
	title: string;
	description: string;
	authors: string[];
	publishedAt: Date;
	updatedAt?: Date;
	series?: string[];
	categories?: string[];
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
	/**
	 * indicate whether the blog post may contain outdated information
	 * or is so after a certain number of days after publication
	 * @default false
	 */
	outdate?: boolean | number;
};

export type MinimalBlogPostMetadata = Omit<BlogPostMetadata, 'id'>;

export type ExtendedBlogPostMetadata = Omit<
	BlogPostMetadata,
	'authors' | 'categories' | 'series'
> & {
	authors: Person[];
	categories: BlogCategory[];
	series: BlogSeries[];
	thumbnail?: Picture;
};

export type BlogPostMetadataDefinition = (lang: App.Language) => MinimalBlogPostMetadata;
