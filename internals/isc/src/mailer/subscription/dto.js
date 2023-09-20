import { string as zString, object as zObject, enum as zEnum, coerce as zCoerce } from 'zod';

import { LanguageSchema } from '../../common/dto';

export const SUBSCRIPTION_DOMAINS = /** @type {const} */ (['job', 'event']);

export const CreateSubscriptionSchema = zObject({
  name: zString().min(1),
  email: zString().min(1).email(),
  domain: zEnum(SUBSCRIPTION_DOMAINS),
  language: LanguageSchema,
});
/**
 * @typedef {import('../../common/types').CommonResponseDTO} CreateSubscriptionResponseDTO
 */
/**
 * @typedef {import('zod').infer<typeof CreateSubscriptionSchema>} CreateSubscriptionRequestDTO
 */

export const UpdateDomainSubscriptionSchema = zObject({
  job: zCoerce.boolean(),
  event: zCoerce.boolean(),
});
/**
 * @typedef {import('../../common/types').CommonResponseDTO} UpdateDomainSubscriptionResponseDTO
 */
/**
 * @typedef {import('zod').infer<typeof UpdateDomainSubscriptionSchema>} UpdateDomainSubscriptionRequestDTO
 */
