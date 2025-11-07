import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, PaginationSchema } from '$lib/utils/schemas';

import { extendBlogPostMetadata, ids, loadBlogPostMetadata } from '../entries';

const BlogPostSearchOptionsSchema = v.object({
	lang: v.optional(LanguageSchema),
	where: v.optional(
		v.object({
			categoryId: v.optional(v.union([v.string(), v.array(v.string())])),
			seriesId: v.optional(v.union([v.string(), v.array(v.string())])),
			authorId: v.optional(v.union([v.string(), v.array(v.string())])),
		}),
	),
	excludedIds: v.optional(v.array(v.string())),
	pagination: v.optional(PaginationSchema),
});

export const searchBlogPosts = query(BlogPostSearchOptionsSchema, async (options) => {
	const { locals } = getRequestEvent();
	const { where, pagination, excludedIds } = options;
	const lang = options.lang ?? locals.language;

	const metadatas = (await Promise.all(ids.map((id) => loadBlogPostMetadata(id, lang)))).filter(
		Boolean,
	);
	const matched = metadatas.filter((metadata) => {
		if (where) {
			const { categoryId, seriesId, authorId } = where;
			if (categoryId) {
				if (Array.isArray(categoryId)) {
					if (!categoryId.some((id) => metadata.categories?.includes(id))) return false;
				} else {
					if (!metadata.categories?.includes(categoryId)) return false;
				}
			}
			if (seriesId) {
				if (Array.isArray(seriesId)) {
					if (!seriesId.some((id) => metadata.series?.includes(id))) return false;
				} else {
					if (!metadata.series?.includes(seriesId)) return false;
				}
			}
			if (authorId) {
				if (Array.isArray(authorId)) {
					if (!authorId.some((id) => metadata.authors?.includes(id))) return false;
				} else {
					if (!metadata.authors?.includes(authorId)) return false;
				}
			}
		}
		if (excludedIds && excludedIds.includes(metadata.id)) return false;
		return true;
	});

	let paginated = matched;
	if (pagination) {
		const { per, page } = pagination;
		paginated = matched.slice(per * (page - 1), per * page);
	}

	const posts = await Promise.all(
		paginated.map((metadata) => extendBlogPostMetadata(metadata, lang)),
	);

	return {
		posts,
		total: matched.length,
	};
});
