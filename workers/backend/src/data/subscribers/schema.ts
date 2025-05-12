import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { SUBSCRIPTION_DOMAINS, domainsToMask, maskToDomains } from './domains';
import { subscribers } from './table';

export const SubscriberSelectSchema = createSelectSchema(subscribers, {
	domains: v.pipe(v.number(), v.transform(maskToDomains)),
});
export const SubscriberInsertSchema = createInsertSchema(subscribers, {
	domains: v.pipe(v.array(v.picklist(SUBSCRIPTION_DOMAINS)), v.transform(domainsToMask)),
});
export const SubscriberUpdateSchema = createUpdateSchema(subscribers, {
	id: v.string(),
	domains: v.pipe(v.array(v.picklist(SUBSCRIPTION_DOMAINS)), v.transform(domainsToMask)),
});

export type SubscriberSelectResult = v.InferOutput<typeof SubscriberSelectSchema>;

export type SubscriberInsertInput = v.InferInput<typeof SubscriberInsertSchema>;
export type SubscriberInsertResult =
	| { success: true; id: string }
	| { success: false; errors: v.FlatErrors<typeof SubscriberInsertSchema> };

export type SubscriberUpdateInput = v.InferInput<typeof SubscriberUpdateSchema>;
export type SubscriberUpdateResult =
	| { success: true }
	| { success: false; errors: v.FlatErrors<typeof SubscriberUpdateSchema> };
