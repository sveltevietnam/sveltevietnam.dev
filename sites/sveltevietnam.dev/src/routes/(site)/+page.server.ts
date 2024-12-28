import { unpackLangVar } from '@internals/i18n/utils';

import { SVELTE_VIETNAM_ORG } from '$data/structured';

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
			structured: SVELTE_VIETNAM_ORG,
			...unpackLangVar(meta, locals.sharedSettings.language),
		},
	};
};
