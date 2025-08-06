import { AtpAgent, AppBskyFeedDefs } from '@atproto/api';

export function createAtpAgent(fetch: typeof globalThis.fetch): AtpAgent {
	return new AtpAgent({
		service: 'https://public.api.bsky.app',
		fetch,
	});
}

export type AggregatedPost = {
	stats: {
		like: number;
		repost: number;
		reply: number;
	};
	post: AppBskyFeedDefs.ThreadViewPost['post'];
	id: string;
	replies: AppBskyFeedDefs.ThreadViewPost[];
	hasMoreReplies: boolean;
};

export async function getPostThread(
	agent: AtpAgent,
	accountId: string,
	postId: string,
	depth?: number,
): Promise<AppBskyFeedDefs.ThreadViewPost> {
	const uri = buildPostUri(accountId, postId, 'at');
	const response = await agent.app.bsky.feed.getPostThread({ uri, depth, parentHeight: 0 });
	if (!response.success) {
		// TODO: log error
		throw new Error('Failed to fetch post thread');
	}
	const thread = response.data.thread;
	if (!AppBskyFeedDefs.isThreadViewPost(thread)) {
		throw new Error('Expected thread view post');
	}

	return thread;
}

export function aggregatePostThread(
	thread: AppBskyFeedDefs.ThreadViewPost,
	maxReplies = 20,
): AggregatedPost {
	return {
		stats: {
			like: thread.post.likeCount ?? 0,
			repost: (thread.post.repostCount ?? 0) + (thread.post.quoteCount ?? 0),
			reply: thread.post.replyCount ?? 0,
		},
		post: thread.post,
		id: thread.post.uri.split('/')[4],
		replies: (thread.replies?.slice(0, maxReplies) ?? []).filter((reply) =>
			AppBskyFeedDefs.isThreadViewPost(reply),
		),
		hasMoreReplies: (thread.replies?.length ?? 0) > maxReplies,
	};
}

export function buildPostUri(
	accountId: string,
	postId: string,
	protocol: 'http' | 'at' = 'http',
): string {
	switch (protocol) {
		case 'at':
			return `at://${accountId}/app.bsky.feed.post/${postId}`;
		case 'http':
		default:
			return `https://bsky.app/profile/${accountId}/post/${postId}`;
	}
}
