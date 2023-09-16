import { string as zString, object as zObject, enum as zEnum, type infer as ZInfer } from 'zod';

import type { CommonResponseDTO } from '$server/common/dto';
import { SUBSCRIPTION_DOMAINS } from '$server/subscriptions/subscriptions.dao';

export const subscriptionSchema = zObject({
  name: zString().min(1),
  email: zString().min(1).email(),
  domain: zEnum(SUBSCRIPTION_DOMAINS),
});

export type SubscriptionRequestDTO = ZInfer<typeof subscriptionSchema>;
export type SubscriptionResponseDTO = CommonResponseDTO;
