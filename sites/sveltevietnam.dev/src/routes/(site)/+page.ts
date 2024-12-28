import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageLoad } from './$types';
import { load as LoadLocales } from './_page/locales/generated';

export const load: PageLoad = async ({ data, depends, parent }) => {
	const { t, sharedSettings } = await parent();
	depends(LOAD_DEPENDENCIES.LANGUAGE);
	return {
		...data,
		t: {
			...t,
			page: (await LoadLocales(sharedSettings.language)),
		},
	};
};
