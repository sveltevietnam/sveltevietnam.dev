import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema } from '$lib/utils/schemas';

import { ids, loadEventMetadata } from '../entries';

import { getEventById } from './get-by-id.remote';

const GetEventBySlugSchema = v.object({
	slug: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const getEventBySlug = query(GetEventBySlugSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { slug, lang = locals.language, optionalModules } = input;
	const series = await Promise.all(ids.map((id) => loadEventMetadata(id, lang)));
	const s = series.find((s) => s?.href.toString() === slug);
	if (!s) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Event not found', code: 'SV000' });
	}
	return getEventById({ id: s.id, lang, optionalModules });
});
