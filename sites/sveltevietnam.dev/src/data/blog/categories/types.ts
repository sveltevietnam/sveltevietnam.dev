import type { Picture } from 'vite-imagetools';

export type BlogCategory = {
	id: string;
	name: string;
	slug: string;
	description: string;
	thumbnail?: Picture;
	ogImage?: string;
};

export type MinimalBlogCategory = Omit<BlogCategory, 'id'>;
export type BlogCategoryDefinition = (lang: App.Language) => MinimalBlogCategory;
export type BlogCategoryOptionalModules = {
	thumbnail?: boolean;
	ogImage?: boolean;
};
