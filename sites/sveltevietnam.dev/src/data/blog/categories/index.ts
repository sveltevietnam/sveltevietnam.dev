import ids from './ids';

export { default as ids } from './ids';

export type BlogCategoryId = (typeof import('./ids').default)[number];

export type BlogCategory = {
	id: string;
	name: string;
	slug: string;
	description: string;
};

export function defineBlogCategory(category: Omit<BlogCategory, 'id'>): Omit<BlogCategory, 'id'> {
	return category;
}

type BlogCategoryModule =
	| {
			default: Omit<BlogCategory, 'id'>;
	  }
	| {
			en: Omit<BlogCategory, 'id'>;
			vi: Omit<BlogCategory, 'id'>;
	  };

const modules = import.meta.glob<BlogCategoryModule>('./*/index.ts');

export async function loadBlogCategory(
	id: string,
	lang: App.Language,
): Promise<BlogCategory | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let category: Omit<BlogCategory, 'id'> ;
	if ('en' in module) {
		category = module[lang];
	} else {
		category = module.default;
	}
	return {
		...category,
		id: id,
	};
}

export async function loadBlogCategoryBySlug(
	slug: string,
	lang: App.Language,
): Promise<BlogCategory | null> {
	const categories = await Promise.all(ids.map((id) => loadBlogCategory(id, lang)));
	return categories.find((category) => category?.slug === slug) ?? null;
}
