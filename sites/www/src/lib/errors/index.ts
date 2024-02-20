import { WWW_ERRORS } from '@internals/isc/www';
import { error, type NumericRange } from '@sveltejs/kit';

export function createMailerSvelteKitError(key: keyof typeof WWW_ERRORS, message?: string) {
	const e = WWW_ERRORS[key];
	return error(e.status as NumericRange<400, 599>, {
		code: e.code,
		message: message ?? e.code,
	});
}
