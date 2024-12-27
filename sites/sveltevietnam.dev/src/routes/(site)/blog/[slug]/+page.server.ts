import { SVELTE_VIETNAM_BLOG } from '$data/structured';
import { build } from '$lib/routing/utils';

import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ parent }) => {
	const { routing } = await parent();
	return {
		meta: {
			structured: SVELTE_VIETNAM_BLOG,
		},
		routing: {
			...routing,
			paths: {
				vi: {
					path: build(routing.paths.vi.path, 'bai-viet-ve-dieu-gi-do'),
					name: 'Bài viết về điều gì đó',
				},
				en: {
					path: build(routing.paths.en.path, 'a-blog-about-something'),
					name: 'A Blog About Something',
				},
			},
		},
	};
};
