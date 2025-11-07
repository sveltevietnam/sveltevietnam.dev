import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema } from '$lib/utils/schemas';

import { loadBlogSeries } from '../entries';

const GetBlogSeriesBySlugSchema = v.object({
	id: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const getBlogSeriesById = query(GetBlogSeriesBySlugSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { id, lang = locals.language, optionalModules } = input;
	const series = await loadBlogSeries(id, lang, optionalModules);
	if (!series) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Series not found', code: 'SV000' });
	}
	return series;
});
