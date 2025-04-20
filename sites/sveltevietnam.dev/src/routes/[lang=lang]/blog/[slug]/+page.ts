import { loadBlogPostContent } from '$data/blog/posts';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ data }) => {
	const content = await loadBlogPostContent(data.post.id, data.lang);

	return {
		...data,
		content,
	};
};
