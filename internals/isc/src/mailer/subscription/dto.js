import { string as zString, object as zObject, enum as zEnum } from 'zod';

import { languageSchema } from '../../common/dto';

export const SUBSCRIPTION_DOMAINS = /** @type {const} */ (['job', 'event']);

export const subscriptionSchema = zObject({
  name: zString().min(1),
  email: zString().min(1).email(),
  domain: zEnum(SUBSCRIPTION_DOMAINS),
  language: languageSchema,
});

/**
 * @typedef {import('../../common/types').CommonResponseDTO} SubscriptionResponseDTO
 */

/**
 * @typedef {import('zod').infer<typeof subscriptionSchema>} SubscriptionRequestDTO
 */
