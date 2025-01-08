import ids from './ids';

export { default as ids } from './ids';

export type BlogSeriesId = (typeof import('./ids').default)[number];

export type BlogSeries = {
	id: string;
	name: string;
	description: string;
	slug: string;
};

export function defineBlogSeries(series: Omit<BlogSeries, 'id'>): Omit<BlogSeries, 'id'> {
	return series;
}

type BlogSeriesModule =
	| {
			default: Omit<BlogSeries, 'id'>;
	  }
	| {
			en: Omit<BlogSeries, 'id'>;
			vi: Omit<BlogSeries, 'id'>;
	  };

const modules = import.meta.glob<BlogSeriesModule>('./*/index.ts');

export async function loadBlogSeries(id: string, lang: App.Language): Promise<BlogSeries | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const module = await modules[path]();
	let series: Omit<BlogSeries, 'id'> ;
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
): Promise<BlogSeries | null> {
	const series = await Promise.all(ids.map((id) => loadBlogSeries(id, lang)));
	return series.find((s) => s?.slug === slug) ?? null;
}
