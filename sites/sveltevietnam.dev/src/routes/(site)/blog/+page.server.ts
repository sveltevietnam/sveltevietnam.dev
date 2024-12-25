import { localizeLangVar } from '@internals/utils/language';

import { SVELTE_VIETNAM_BLOG } from '$data/structured';
import { toStringWithContext } from '$lib/meta';

import type { PageServerLoad } from './$types';

const meta = {
	vi: {
		title: 'Blog | Svelte Việt Nam',
		description:
			'Nơi để mọi người cùng viết và chia sẻ kinh nghiệm và kiến thức về hệ sinh thái và cộng đồng Svelte',
		keywords: ['blog', 'viết', 'chia sẻ', 'cộng đồng', 'tham gia', 'đóng góp'],
	},
	en: {
		title: 'Blog | Svelte Vietnam',
		description:
			'A place for everyone to write, share experience and knowledge about Svelte, its ecosystem and community',
		keywords: ['blog', 'writing', 'sharing', 'community', 'involvement', 'contribution'],
	},
};

export const load: PageServerLoad = ({ locals }) => {
	return {
		meta: {
			structured: toStringWithContext(SVELTE_VIETNAM_BLOG),
			...localizeLangVar(locals.language, meta),
		},
	};
};
