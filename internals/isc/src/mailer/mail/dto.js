import { string as zString, object as zObject, record as zRecord, enum as zEnum } from 'zod';

export const EMAIL_TEMPLATES = /** @type {const} */ (['SUBSCRIPTION_SUCCESS']);

export const sendSchema = zObject({
  templateId: zEnum(EMAIL_TEMPLATES),
  variables: zRecord(zString(), zString()).optional(),
  to: zObject({
    email: zString().email().min(1),
    name: zString().min(1),
  }),
});

/**
 * @typedef {import('../../common/types').CommonResponseDTO} SendResponseDTO
 */

/**
 * @typedef {import('zod').infer<typeof sendSchema>} SendRequestDTO
 */
