export type BlogSeries = {
	id: string;
	name: string;
	description: string;
	slug: string;
};

export type MinimalBlogSeries = Omit<BlogSeries, 'id'>;
export type BlogSeriesDefinition = (lang: App.Language) => MinimalBlogSeries;
