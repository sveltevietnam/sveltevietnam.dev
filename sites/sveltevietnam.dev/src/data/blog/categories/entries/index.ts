import type { Language } from '@sveltevietnam/kit/constants';
import type { Picture } from 'vite-imagetools';

import type * as t from '../types';

export function defineBlogCategory(def: t.BlogCategoryDefinition): t.BlogCategoryDefinition {
	return def;
}

const modules = import.meta.glob<t.BlogCategoryDefinition>('./*/index.ts', {
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

export async function loadBlogCategory(
	id: string,
	lang: Language,
	optionalModules?: Partial<t.BlogCategoryOptionalModules> | true,
): Promise<t.BlogCategory | null> {
	const path = `./${id}/index.ts`;
	if (!modules[path]) return null;
	const def = await modules[path]();
	const category = def(lang);

	// eslint-disable-next-line prefer-const
	let { thumbnail, ogImage, ...rest } = category;
	[thumbnail, ogImage] = await Promise.all([
		optionalModules === true || optionalModules?.thumbnail
			? thumbnail
				? thumbnail
				: loadBlogCategoryThumbnail(id)
			: undefined,
		optionalModules === true || optionalModules?.ogImage
			? ogImage
				? ogImage
				: loadBlogCategoryOgImage(id)
			: undefined,
	]);

	return {
		...rest,
		id: id,
		thumbnail,
		ogImage,
	};
}

export async function loadBlogCategoryThumbnail(id: string): Promise<Picture | undefined> {
	const path = `./${id}/thumbnail.jpg`;
	if (!thumbnailModules[path]) return undefined;
	return thumbnailModules[path]();
}

export async function loadBlogCategoryOgImage(id: string): Promise<string | undefined> {
	const path = `./${id}/thumbnail.jpg`;
	if (!ogImageModules[path]) return undefined;
	return ogImageModules[path]();
}
