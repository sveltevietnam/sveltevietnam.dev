import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema, PaginationSchema } from '$lib/utils/schemas';

import { ids, loadBlogSeries } from '../entries';

const ListBlogSeriesSchema = v.object({
	...PaginationSchema.entries,
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const listBlogSeries = query(ListBlogSeriesSchema, async (options) => {
	const { locals } = getRequestEvent();
	const { page, per, lang = locals.language, optionalModules } = options;
	const paginatedIds = ids.slice(per * (page - 1), per * page);
	return {
		series: (
			await Promise.all(paginatedIds.map((id) => loadBlogSeries(id, lang, optionalModules)))
		).filter(Boolean),
		total: ids.length,
	};
});
