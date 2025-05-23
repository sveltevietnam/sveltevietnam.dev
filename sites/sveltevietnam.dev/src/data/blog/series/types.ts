import type { Picture } from 'vite-imagetools';

export type BlogSeries = {
	id: string;
	name: string;
	description: string;
	slug: string;
	thumbnail?: Picture;
	ogImage?: string;
};

export type MinimalBlogSeries = Omit<BlogSeries, 'id'>;
export type BlogSeriesDefinition = (lang: App.Language) => MinimalBlogSeries;
export type BlogSeriesOptionalModules = {
	thumbnail?: boolean;
	ogImage?: boolean;
};
