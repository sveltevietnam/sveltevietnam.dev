import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { form, getRequestEvent } from '$app/server';
import { getBackend } from '$lib/backend/utils';

import { createSubscribeSchema, type SubscribeSchema } from './subscribe.schema.server';

type SubscribeResult =
	| {
			success: true;
			action: 'insert' | 'update';
	  }
	| {
			success: false;
	  };

export const subscribe = form('unchecked' as unknown as SubscribeSchema, async (input, invalid) => {
	const { locals } = getRequestEvent();
	const schema = createSubscribeSchema();
	const parsed = await v.safeParseAsync(schema, input);
	if (!parsed.success) {
		invalid(...parsed.issues);
		return { success: false } as SubscribeResult;
	}

	const backend = getBackend();
	try {
		const result = await backend.subscribers().upsert({
			...parsed.output,
			language: locals.language,
		});
		if (!result.success) {
			// integration error
			console.error(result.errors);
			error(500, { code: 'SV001', message: 'Integration error' });
		}
		return { success: true, action: result.action } as SubscribeResult;
	} catch (e) {
		// TODO: error logging
		console.error(e);
		error(500, { code: 'SV001', message: 'Error from backend' });
	}
});
