import type * as t from './types';
export type * from './types';

export function defineBlogSeries(series: Omit<t.BlogSeries, 'id'>): Omit<t.BlogSeries, 'id'> {
	return series;
}

const modules = import.meta.glob<t.BlogSeriesModule>('./*/index.ts');
const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadBlogSeries(id: string, lang: App.Language): Promise<t.BlogSeries | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let series: Omit<t.BlogSeries, 'id'>;
	if ('en' in module) {
		series = module[lang];
	} else {
		series = module.default;
	}
	return {
		...series,
		id: id,
	};
}

export async function loadBlogSeriesBySlug(
	slug: string,
	lang: App.Language,
): Promise<t.BlogSeries | null> {
	const series = await Promise.all(ids.map((id) => loadBlogSeries(id, lang)));
	return series.find((s) => s?.slug === slug) ?? null;
}
