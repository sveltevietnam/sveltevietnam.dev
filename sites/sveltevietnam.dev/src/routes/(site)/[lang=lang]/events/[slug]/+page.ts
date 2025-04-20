import { loadEventContent } from '$data/events';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const content = await loadEventContent(data.event.id);

	return {
		...data,
		content,
	};
};
