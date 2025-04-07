export type BlogCategory = {
	id: string;
	name: string;
	slug: string;
	description: string;
};

export type BlogCategoryModule =
	| {
			default: Omit<BlogCategory, 'id'>;
	  }
	| {
			en: Omit<BlogCategory, 'id'>;
			vi: Omit<BlogCategory, 'id'>;
	  };
