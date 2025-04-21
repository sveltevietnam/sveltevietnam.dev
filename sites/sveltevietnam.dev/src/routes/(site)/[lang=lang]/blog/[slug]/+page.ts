import { loadBlogPostContent } from '$data/blog/posts';

import type { PageLoad } from './$types';

export const load: PageLoad = async ({ params, data }) => {
	const { lang } = params;
	const content = await loadBlogPostContent(data.post.id, lang);

	return {
		...data,
		content,
	};
};
