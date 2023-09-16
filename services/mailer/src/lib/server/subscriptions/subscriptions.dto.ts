import { string as zString, object as zObject, enum as zEnum, type infer as ZInfer } from 'zod';

import { SUBSCRIPTION_DOMAINS } from '$server/subscriptions/subscriptions.dao';

export const subscriptionSchema = zObject({
  name: zString().min(1),
  email: zString().min(1).email(),
  domain: zEnum(SUBSCRIPTION_DOMAINS),
});

export type SubscriptionDTO = ZInfer<typeof subscriptionSchema>;
