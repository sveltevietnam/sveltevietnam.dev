import { unpackLangVar } from '@internals/i18n/utils';

import { SVELTE_VIETNAM_ORG } from '$data/structured';

import type { PageServerLoad } from './$types';

const meta = {
	vi: {
		title: 'Thiết kế | Svelte Việt Nam',
		description: 'Giản lược về hệ thống chữ viết, bảng màu, logo của dự án Svelte Việt Nam',
		keywords: [
			'thiết kế',
			'ý tưởng',
			'chữ viết',
			'màu sắc',
			'hệ thống',
			'sáng tạo',
			'cảm hứng',
			'logo',
		],
	},
	en: {
		title: 'Design | Svelte Vietnam',
		description: 'Overview of typography, color system, logo of the Svelte Vietnam project',
		keywords: [
			'design',
			'idea',
			'typography',
			'color',
			'system',
			'creativity',
			'inspiration',
			'logo',
		],
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
