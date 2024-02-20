import { string as zString, object as zObject, record as zRecord, enum as zEnum } from 'zod';

import { LanguageSchema } from '../../common/dto.js';

export const EMAIL_TEMPLATES = /** @type {const} */ ([
	'WELCOME',
	'SPRING_2024_HCM_MEETUP_REGISTRATION',
]);

export const SendRequestSchema = zObject({
	language: LanguageSchema,
	templateId: zEnum(EMAIL_TEMPLATES),
	variables: zRecord(zString(), zString()).optional(),
	to: zObject({
		email: zString().email().min(1),
		name: zString().min(1),
	}),
});
/**
 * @typedef {import('../../common/types.js').CommonResponseDTO} SendResponseDTO
 */
/**
 * @typedef {import('zod').infer<typeof SendRequestSchema>} SendRequestDTO
 */
