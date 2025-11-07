import * as v from 'valibot';

import { query } from '$app/server';
import { LanguageSchema, PaginationSchema } from '$lib/utils/schemas';

import { ids } from '../entries';
import type * as t from '../types';

import { getBlogPostById } from './get-by-id.remote';

const ListBlogPostsSchema = v.object({
	...PaginationSchema.entries,
	lang: v.optional(LanguageSchema),
});

export const listBlogPosts = query(ListBlogPostsSchema, async (options) => {
	const { page, per, lang } = options;
	const paginatedIds = ids.slice(per * (page - 1), per * page);
	return {
		posts: (await Promise.all(
			paginatedIds.map((id) => getBlogPostById({ id, lang })),
		)) as t.ExtendedBlogPostMetadata[],
		total: ids.length,
	};
});
