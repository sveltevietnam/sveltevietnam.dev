import type { ParamMatcher } from '@sveltejs/kit';

import { LANGUAGES } from '$shared/services/i18n';
import type { Language } from '$shared/services/i18n';

export const match: ParamMatcher = (param) => {
  return LANGUAGES.includes(param as Language);
};
