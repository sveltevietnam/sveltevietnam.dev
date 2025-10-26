import type { Language } from '@sveltevietnam/kit/constants';
import type { Picture } from 'vite-imagetools';

import type * as t from './types';
export type * from './types';

export function defineBlogSeries(def: t.BlogSeriesDefinition): t.BlogSeriesDefinition {
	return def;
}

const modules = import.meta.glob<t.BlogSeriesDefinition>('./*/index.ts', {
	import: 'default',
});
const thumbnailModules = import.meta.glob<Picture>('./*/thumbnail.jpg', {
	import: 'default',
	query: '?enhanced&w=1200;600',
});
const ogImageModules = import.meta.glob<string>('./*/thumbnail.jpg', {
	import: 'default',
	query: '?w=1200',
});

export const ids = Object.keys(modules).map((path) => path.split('/')[1]);

export async function loadBlogSeries(
	id: string,
	lang: Language,
	optionalModules?: Partial<t.BlogSeriesOptionalModules> | true,
): Promise<t.BlogSeries | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();

	const [thumbnail, ogImage] = await Promise.all([
		optionalModules === true || optionalModules?.thumbnail
			? loadBlogSeriesThumbnail(id)
			: undefined,
		optionalModules === true || optionalModules?.ogImage ? loadBlogSeriesOgImage(id) : undefined,
	]);

	return {
		...def(lang),
		id: id,
		thumbnail,
		ogImage,
	};
}

export async function loadAllBlogSeries(lang: Language): Promise<t.BlogSeries[]> {
	return Promise.all(ids.map((id) => loadBlogSeries(id, lang))).then((series) =>
		series.filter(Boolean),
	);
}

export async function loadBlogSeriesBySlug(
	slug: string,
	lang: Language,
	optionalModules?: Partial<t.BlogSeriesOptionalModules> | true,
): Promise<t.BlogSeries | null> {
	const series = await Promise.all(ids.map((id) => loadBlogSeries(id, lang, optionalModules)));
	return series.find((s) => s?.slug.toString() === slug) ?? null;
}

export async function loadBlogSeriesThumbnail(id: string): Promise<Picture | undefined> {
	const path = `./${id}/thumbnail.jpg`;
	if (!thumbnailModules[path]) return undefined;
	return thumbnailModules[path]();
}

export async function loadBlogSeriesOgImage(id: string): Promise<string | undefined> {
	const path = `./${id}/thumbnail.jpg`;
	if (!ogImageModules[path]) return undefined;
	return ogImageModules[path]();
}
