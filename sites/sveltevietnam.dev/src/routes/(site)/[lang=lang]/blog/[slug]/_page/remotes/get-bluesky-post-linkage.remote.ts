import * as v from 'valibot';

import { query } from '$app/server';
import { getBackend } from '$lib/backend/utils';

export type BlueskyPostLinkage = {
	accountId: string;
	postId: string;
};

export const getBlueskyPostLinkage = query(v.string(), async (blogId) => {
	const backend = getBackend();
	if (!backend) return null;
	const linkage = await backend.blueskyPosts().getByPostId(blogId);
	if (!linkage) return null;
	return {
		postId: linkage.blueskyPostId,
		accountId: linkage.blueskyAccountId,
	} satisfies BlueskyPostLinkage;
});
