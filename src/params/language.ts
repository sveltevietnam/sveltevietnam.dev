import type { ParamMatcher } from '@sveltejs/kit';

import { LANGUAGES } from '$shared/constants';
import type { Language } from '$shared/types';

export const match: ParamMatcher = (param) => {
  return LANGUAGES.includes(param as Language);
};
