import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema, PaginationSchema } from '$lib/utils/schemas';

import { ids, loadPerson } from '../entries';

const ListPersonsSchema = v.object({
	...PaginationSchema.entries,
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(
		v.partial(
			v.object({
				...OptionalModulesSchema.entries,
				popImage: v.boolean(),
			}),
		),
	),
});

export const listPeople = query(ListPersonsSchema, async (options) => {
	const { locals } = getRequestEvent();
	const { page, per, lang = locals.language, optionalModules } = options;
	const paginatedIds = ids.slice(per * (page - 1), per * page);
	return {
		people: (
			await Promise.all(paginatedIds.map((id) => loadPerson(id, lang, optionalModules)))
		).filter(Boolean),
		total: ids.length,
	};
});
