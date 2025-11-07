import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema } from '$lib/utils/schemas';

import { ids, loadBlogSeries } from '../entries';

import { getBlogSeriesById } from './get-by-id.remote';

const GetBlogSeriesBySlugSchema = v.object({
	slug: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const getBlogSeriesBySlug = query(GetBlogSeriesBySlugSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { slug, lang = locals.language, optionalModules } = input;
	const series = await Promise.all(ids.map((id) => loadBlogSeries(id, lang)));
	const s = series.find((s) => s?.slug.toString() === slug);
	if (!s) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Series not found', code: 'SV000' });
	}
	return getBlogSeriesById({ id: s.id, lang, optionalModules });
});
