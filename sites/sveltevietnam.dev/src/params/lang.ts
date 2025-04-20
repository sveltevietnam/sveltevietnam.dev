import type { ParamMatcher } from '@sveltejs/kit';
import { LANGUAGES } from '@sveltevietnam/i18n';

export const match = ((param: string): param is App.Language => {
	return LANGUAGES.includes(param);
}) satisfies ParamMatcher;
