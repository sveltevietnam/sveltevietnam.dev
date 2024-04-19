import { LOAD_DEPENDENCIES } from '$lib/constants';
import { preparePageData } from '$lib/data/blog';

import type { PageServerLoad } from './$types';
import { post, content } from './_page/data';

export const load: PageServerLoad = ({ url, depends, locals }) => {
	const lang = locals.settings.language;
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return preparePageData(url, lang, post, content);
};
