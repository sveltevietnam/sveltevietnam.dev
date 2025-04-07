export type BlogSeries = {
	id: string;
	name: string;
	description: string;
	slug: string;
};

export type BlogSeriesModule =
	| {
			default: Omit<BlogSeries, 'id'>;
	  }
	| {
			en: Omit<BlogSeries, 'id'>;
			vi: Omit<BlogSeries, 'id'>;
	  };
