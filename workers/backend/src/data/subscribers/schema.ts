import { createSelectSchema, createInsertSchema, createUpdateSchema } from 'drizzle-valibot';
import * as v from 'valibot';

import { SUBSCRIPTION_CHANNELS, channelsToMask, maskToChannels } from './channels';
import { subscribers } from './table';

export const SubscriberSelectSchema = createSelectSchema(subscribers, {
	channels: v.pipe(v.number(), v.transform(maskToChannels)),
});
export const SubscriberInsertSchema = createInsertSchema(subscribers, {
	channels: v.pipe(v.array(v.picklist(SUBSCRIPTION_CHANNELS)), v.transform(channelsToMask)),
});
export const SubscriberUpdateSchema = createUpdateSchema(subscribers, {
	id: v.string(),
	channels: v.pipe(v.array(v.picklist(SUBSCRIPTION_CHANNELS)), v.transform(channelsToMask)),
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
