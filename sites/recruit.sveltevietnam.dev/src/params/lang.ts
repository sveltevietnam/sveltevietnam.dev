import type { ParamMatcher } from '@sveltejs/kit';
import type { Language } from '@sveltevietnam/i18n';
import { LANGUAGES } from '@sveltevietnam/i18n';

export const match = ((param: string): param is Language => {
	return LANGUAGES.includes(param);
}) satisfies ParamMatcher;
