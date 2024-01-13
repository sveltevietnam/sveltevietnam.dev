import { LOAD_DEPENDENCIES } from '$lib/constants';
import { preparePageData } from '$shared/data/blog';

import type { PageServerLoad } from './$types';
import { post, content } from './_page/data';

export const load: PageServerLoad = ({ url, depends, locals: { language } }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return preparePageData(url, language, post, content);
};
