// use @atproto/api for typing to avoid the unnecessary dependencies in final bundle
import type { AppBskyFeedDefs, $Typed } from '@atproto/api';

export type AggregatedPost = {
	stats: {
		like: number;
		repost: number;
		reply: number;
	};
	post: $Typed<AppBskyFeedDefs.ThreadViewPost>['post'];
	id: string;
	replies: $Typed<AppBskyFeedDefs.ThreadViewPost>[];
	hasMoreReplies: boolean;
};

export async function getPostThread(input: {
	accountId: string;
	postId: string;
	depth?: number;
}): Promise<$Typed<AppBskyFeedDefs.ThreadViewPost>> {
	// construct request url
	const { accountId, postId, depth } = input;
	const url = new URL('https://api.bsky.app/xrpc/app.bsky.feed.getPostThread');
	url.searchParams.set('uri', buildPostUri(accountId, postId, 'at'));
	url.searchParams.set('parentHeight', '0');
	if (depth) url.searchParams.set('depth', depth.toString());

	// fetch thread
	const response = await fetch(url);
	if (!response.ok) {
		// TODO: log error
		throw new Error('Failed to fetch post thread');
	}

	// guard response type
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const thread = ((await response.json()) as any).thread as $Typed<AppBskyFeedDefs.ThreadViewPost>;
	if (thread.$type !== 'app.bsky.feed.defs#threadViewPost') {
		throw new Error('Expected thread view post');
	}

	return thread;
}

export function aggregatePostThread(
	thread: $Typed<AppBskyFeedDefs.ThreadViewPost>,
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
		replies: (thread.replies?.slice(0, maxReplies) ?? []).filter(
			(reply) => reply.$type === 'app.bsky.feed.defs#threadViewPost',
		) as $Typed<AppBskyFeedDefs.ThreadViewPost>[],
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
