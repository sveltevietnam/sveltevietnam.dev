---
to: <%= baseDir %>/+page.server.ts
unless_exists: true
---
import { LOAD_DEPENDENCIES } from '$shared/constants';
import { preparePageData } from '$shared/data/blog';

import type { PageServerLoad } from './$types';
import { post, content } from './_page/data';

export const load: PageServerLoad = ({ depends, locals: { language } }) => {
  depends(LOAD_DEPENDENCIES.LANGUAGE);
  return preparePageData(language, post, content);
};
