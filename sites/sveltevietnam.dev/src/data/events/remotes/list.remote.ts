import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema, PaginationSchema } from '$lib/utils/schemas';

import { ids, loadEventMetadata } from '../entries';

const ListEventsSchema = v.object({
	...PaginationSchema.entries,
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const listEvents = query(ListEventsSchema, async (options) => {
	const { locals } = getRequestEvent();
	const { page, per, lang = locals.language, optionalModules } = options;
	const paginatedIds = ids.slice(per * (page - 1), per * page);
	return {
		events: (
			await Promise.all(paginatedIds.map((id) => loadEventMetadata(id, lang, optionalModules)))
		).filter(Boolean),
		total: ids.length,
	};
});
