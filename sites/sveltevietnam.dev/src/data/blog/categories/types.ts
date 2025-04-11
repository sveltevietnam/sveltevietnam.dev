export type BlogCategory = {
	id: string;
	name: string;
	slug: string;
	description: string;
};

export type MinimalBlogCategory = Omit<BlogCategory, 'id'>;
export type BlogCategoryDefinition = (lang: App.Language) => MinimalBlogCategory;
