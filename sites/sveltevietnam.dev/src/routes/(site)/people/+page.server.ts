import { loadPerson, ids } from '$data/people';
import { LOAD_DEPENDENCIES } from '$lib/constants';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ locals, depends }) => {
	depends(LOAD_DEPENDENCIES.LANGUAGE);

	return {
		people: (
			await Promise.all(ids.map((id) => loadPerson(id, locals.sharedSettings.language, true)))
		).filter(Boolean),
	};
};
