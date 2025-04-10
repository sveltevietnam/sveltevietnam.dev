import type * as t from './types';
export type * from './types';

export function defineBlogCategory(
	category: Omit<t.BlogCategory, 'id'>,
): Omit<t.BlogCategory, 'id'> {
	return category;
}

const modules = import.meta.glob<t.BlogCategoryModule>('./*/index.ts');
export const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadBlogCategory(
	id: string,
	lang: App.Language,
): Promise<t.BlogCategory | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let category: Omit<t.BlogCategory, 'id'>;
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
): Promise<t.BlogCategory | null> {
	const categories = await Promise.all(ids.map((id) => loadBlogCategory(id, lang)));
	return categories.find((category) => category?.slug === slug) ?? null;
}
