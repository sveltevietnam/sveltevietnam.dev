import type * as t from './types';
export type * from './types';

export function defineBlogSeries(def: t.BlogSeriesDefinition): t.BlogSeriesDefinition {
	return def;
}

const modules = import.meta.glob<t.BlogSeriesDefinition>('./*/index.ts', {
	import: 'default',
});
export const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadBlogSeries(id: string, lang: App.Language): Promise<t.BlogSeries | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();
	return {
		...def(lang),
		id: id,
	};
}

export async function loadBlogSeriesBySlug(
	slug: string,
	lang: App.Language,
): Promise<t.BlogSeries | null> {
	const series = await Promise.all(ids.map((id) => loadBlogSeries(id, lang)));
	return series.find((s) => s?.slug.toString() === slug) ?? null;
}
