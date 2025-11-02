import { object, string, picklist, optional, record } from 'valibot';
/**
 * @template {string} Language
 * @param {ReadonlyArray<Language>} languages
 * @returns {import('.').MessageQueryInputSchema<Language>}
 */
export function createMessageQueryInputSchema(languages) {
	return object({
		key: string(),
		lang: picklist(languages),
		params: optional(record(string(), string())),
	});
}
