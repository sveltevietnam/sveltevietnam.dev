import type * as t from './types';
export type * from './types';

export function defineBlogCategory(def: t.BlogCategoryDefinition): t.BlogCategoryDefinition {
	return def;
}

const modules = import.meta.glob<t.BlogCategoryDefinition>('./*/index.ts', {
	import: 'default',
});
export const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadBlogCategory(
	id: string,
	lang: App.Language,
): Promise<t.BlogCategory | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();
	return {
		...def(lang),
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
