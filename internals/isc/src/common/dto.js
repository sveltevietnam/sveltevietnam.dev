import { enum as zEnum } from 'zod';

export const LANGUAGES = /** @type {const} */ (['en', 'vi']);
export const LanguageSchema = zEnum(LANGUAGES);
/** @typedef {import('zod').infer<typeof LanguageSchema>} Language */
