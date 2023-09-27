import { string as zString, object as zObject, enum as zEnum, coerce as zCoerce } from 'zod';

import { LanguageSchema } from '../../common/dto';

export const SUBSCRIPTION_DOMAINS = /** @type {const} */ (['job', 'event', 'blog']);
export const SubscriptionDomainSchema = zEnum(SUBSCRIPTION_DOMAINS);
/** @typedef {typeof SUBSCRIPTION_DOMAINS[number]} SubscriptionDomain */

export const GetSubscriptionResponseSchema = zObject({
  name: zString(),
  job: zCoerce.boolean(),
  event: zCoerce.boolean(),
  blog: zCoerce.boolean(),
});
/**
 * @typedef {import('../../common/types').CommonResponseDTO<import('zod').infer<typeof GetSubscriptionResponseSchema>>} GetSubscriptionResponseDTO
 */

export const CreateSubscriptionRequestSchema = zObject({
  name: zString().min(1),
  email: zString().min(1).email(),
  domain: SubscriptionDomainSchema,
  language: LanguageSchema,
});
/**
 * @typedef {import('../../common/types').CommonResponseDTO} CreateSubscriptionResponseDTO
 */
/**
 * @typedef {import('zod').infer<typeof CreateSubscriptionRequestSchema>} CreateSubscriptionRequestDTO
 */

export const UpdateDomainSubscriptionRequestSchema = zObject({
  job: zCoerce.boolean(),
  event: zCoerce.boolean(),
  blog: zCoerce.boolean(),
});
/**
 * @typedef {import('../../common/types').CommonResponseDTO} UpdateDomainSubscriptionResponseDTO
 */
/**
 * @typedef {import('zod').infer<typeof UpdateDomainSubscriptionRequestSchema>} UpdateDomainSubscriptionRequestDTO
 */
