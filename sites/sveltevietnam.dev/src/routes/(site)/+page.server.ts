import { localizeLangVar } from '@internals/utils/language';

import { SVELTE_VIETNAM_ORG } from '$data/structured';
import { toStringWithContext } from '$lib/meta';

import type { PageServerLoad } from './$types';

const meta = {
	vi: {
		title: 'Trang chủ | Svelte Việt Nam',
		description: 'Cộng đồng và trung tâm thông tin cho Svelte tại Việt Nam',
		keywords: ['công nghệ', 'thông tin', 'cộng đồng', 'dự án', 'tác động', 'việc làm', 'sự kiện'],
	},
	en: {
		title: 'Home | Svelte Vietnam',
		description: 'Community and go-to information hub for people of Svelte in Vietnam',
		keywords: ['technology', 'information', 'community', 'project', 'impact', 'job', 'event'],
	},
};

export const load: PageServerLoad = ({ locals }) => {
	return {
		meta: {
			structured: toStringWithContext(SVELTE_VIETNAM_ORG),
			...localizeLangVar(locals.language, meta),
		},
	};
};
