import { MAILER_ERRORS } from '@internals/isc/mailer';
import { error, type NumericRange } from '@sveltejs/kit';

export function createMailerSvelteKitError(key: keyof typeof MAILER_ERRORS, message?: string) {
	const e = MAILER_ERRORS[key];
	return error(e.status as NumericRange<400, 599>, {
		code: e.code,
		message: message ?? e.code,
	});
}
