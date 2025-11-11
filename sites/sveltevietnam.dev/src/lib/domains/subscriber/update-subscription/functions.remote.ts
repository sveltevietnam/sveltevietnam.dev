import { error } from '@sveltejs/kit';
import * as v from 'valibot';

import { form, query } from '$app/server';
import { getBackend } from '$lib/backend/utils';

import { createUpdateSubscriptionSchema, type UpdateSubscriptionSchema } from './schema.server';

export const getSubscription = query(v.string(), async (subscriberId) => {
	const subscription = await getBackend().subscribers().getById(subscriberId);
	if (!subscription) {
		// TODO: error logging
		error(404, { code: 'SV001', message: 'Subscription not found' });
	}
	return subscription;
});

export const updateSubscription = form(
	'unchecked' as unknown as UpdateSubscriptionSchema,
	async (input, invalid) => {
		const schema = createUpdateSubscriptionSchema();
		const parsed = await v.safeParseAsync(schema, input);
		if (!parsed.success) {
			invalid(...parsed.issues);
			return { success: false };
		}

		const backend = getBackend();
		const result = await backend.subscribers().update(parsed.output);
		if (!result.success) {
			// integration error
			console.error(result.errors);
			error(500, { code: 'SV001', message: 'Integration error' });
		}
		return { success: true };
	},
);
