import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema, OptionalModulesSchema } from '$lib/utils/schemas';

import { loadEventMetadata } from '../entries';

const GetEventByIdSchema = v.object({
	id: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(v.partial(OptionalModulesSchema)),
});

export const getEventById = query(GetEventByIdSchema, async (input) => {
	const { locals } = getRequestEvent();
	const { id, lang = locals.language, optionalModules } = input;
	const event = await loadEventMetadata(id, lang, optionalModules);
	if (!event) {
		// TODO: assign a unique code to this error
		error(404, { message: 'Event not found', code: 'SV000' });
	}
	return event;
});
