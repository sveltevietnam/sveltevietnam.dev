import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { getRequestEvent, query } from '$app/server';
import { LanguageSchema } from '$lib/utils/schemas';

import { loadPerson } from '../entries';
import type * as t from '../types';

const GetPersonByIdSchema = v.object({
	id: v.string(),
	lang: v.optional(LanguageSchema),
	optionalModules: v.optional(
		v.partial(
			v.object({
				ogImage: v.boolean(),
				popImage: v.boolean(),
				avatar: v.boolean(),
			}),
		),
	),
});

export const getPersonById = query.batch(GetPersonByIdSchema, async (inputs) => {
	const { locals } = getRequestEvent();

	const dedupedInputMap = new Map<string, v.InferInput<typeof GetPersonByIdSchema>>();
	for (const input of inputs) {
		const stringified = JSON.stringify(input);
		if (!dedupedInputMap.has(stringified)) {
			dedupedInputMap.set(stringified, input);
		}
	}

	const lookup = new Map<string, t.Person>();
	await Promise.all(
		dedupedInputMap.entries().map(async ([key, input]) => {
			const { id, lang = locals.language, optionalModules } = input;
			const person = await loadPerson(id, lang, optionalModules);
			if (person) {
				lookup.set(key, person);
			}
		}),
	);

	return (input) => {
		const person = lookup.get(JSON.stringify(input));
		if (!person) {
			// TODO: assign a unique code to this error
			error(404, { message: 'Person not found', code: 'SV000' });
		}
		return person;
	};
});
