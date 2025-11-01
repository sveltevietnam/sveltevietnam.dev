import type { ParamMatcher } from '@sveltejs/kit';
import { LANGUAGES, type Language } from '@sveltevietnam/kit/constants';

export const match = ((param: string): param is Language => {
	return LANGUAGES.includes(param);
}) satisfies ParamMatcher;
