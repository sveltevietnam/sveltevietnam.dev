import { load as loadLocales } from '$data/locales/generated';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { LayoutLoad } from './$types';

export const load: LayoutLoad = async ({ data, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		...data,
		t: {
			...(await loadLocales(data.sharedSettings.language)),
		},
	};
};
