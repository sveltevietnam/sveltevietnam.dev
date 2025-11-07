import * as v from 'valibot';

import { query } from '$app/server';
import { getBackend } from '$lib/backend/utils';

export type BlueskyPostLinkage = {
	accountId: string;
	postId: string;
};

const GetBlueskyPostLinkageSchema = v.object({
	postId: v.string(),
});

export const getBlueskyPostLinkage = query(GetBlueskyPostLinkageSchema, async ({ postId }) => {
	const backend = getBackend({ throwOnDisconnected: false });
	if (!backend) return null;
	const linkage = await backend.blueskyPosts().getByPostId(postId);
	if (!linkage) return null;
	return {
		postId: linkage.blueskyPostId,
		accountId: linkage.blueskyAccountId,
	} satisfies BlueskyPostLinkage;
});
