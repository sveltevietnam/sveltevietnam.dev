import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { SUBSCRIPTION_CHANNELS, channelsToMask, maskToChannels } from './channels';
import { subscribers } from './tables';

export const SubscriberSelectSchema = createSelectSchema(subscribers, {
	id: v.pipe(v.string(), v.startsWith('subscriber_')),
	channels: v.pipe(v.number(), v.transform(maskToChannels)),
});
export const SubscriberInsertSchema = createInsertSchema(subscribers, {
	id: v.optional(v.pipe(v.string(), v.startsWith('subscriber_'))),
	channels: v.pipe(v.array(v.picklist(SUBSCRIPTION_CHANNELS)), v.transform(channelsToMask)),
});
export const SubscriberUpdateSchema = createUpdateSchema(subscribers, {
	id: v.pipe(v.string(), v.startsWith('subscriber_')),
	channels: v.pipe(v.array(v.picklist(SUBSCRIPTION_CHANNELS)), v.transform(channelsToMask)),
});

export type SubscriberSelectResult = v.InferOutput<typeof SubscriberSelectSchema>;

export type SubscriberUpsertInput = v.InferInput<typeof SubscriberInsertSchema>;
export type SubscriberUpsertResult =
	| { success: true; id: string; action: 'insert' | 'update' }
	| { success: false; errors: v.FlatErrors<typeof SubscriberInsertSchema> };

export type SubscriberUpdateInput = v.InferInput<typeof SubscriberUpdateSchema>;
export type SubscriberUpdateResult =
	| { success: true }
	| { success: false; errors: v.FlatErrors<typeof SubscriberUpdateSchema> };
