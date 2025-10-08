<script lang="ts">
	import type AtpAgent from '@atproto/api';
	import { T } from '@sveltevietnam/i18n/runtime';
	import { formatTimeDiff } from '@sveltevietnam/kit/utilities/datetime';

	import { browser } from '$app/environment';
	import * as m from '$data/locales/generated/messages';
	import * as bluesky from '$lib/bluesky';
	import { Avatar } from '$lib/components/avatar';

	let { accountId, postId }: { accountId: string; postId: string } = $props();

	const BLUESKY_STATS_CONFIG = {
		reply: {
			icon: 'i-[ph--chat]',
			message: m['pages.blog_slug.comments.bluesky.stats.reply'],
		},
		repost: {
			icon: 'i-[ph--repeat]',
			message: m['pages.blog_slug.comments.bluesky.stats.repost'],
		},
		like: {
			icon: 'i-[ph--heart]',
			message: m['pages.blog_slug.comments.bluesky.stats.like'],
		},
	};

	let agent: AtpAgent | null = null;
	let postUrl = $derived(bluesky.buildPostUri(accountId, postId, 'http'));
	let threadPromise: Promise<bluesky.AggregatedPost> = $derived.by(async () => {
		if (!browser) return new Promise(() => {});
		if (!agent) agent = bluesky.createAtpAgent(fetch);
		return bluesky.aggregatePostThread(await bluesky.getPostThread(agent, accountId, postId));
	});
</script>

<section class="max-w-pad py-section mobile:overflow-auto space-y-10" data-pagefind-ignore>
	<h2 class="c-text-heading border-outline border-b" id="comments">
		<T message={m['pages.blog_slug.comments.heading']} />
	</h2>
	<div
		class="tablet:items-start tablet:gap-8 desktop:gap-10 widescreen:gap-20 tablet:flex-row relative flex flex-col-reverse gap-10"
	>
		<!-- replies -->
		<div class="flex-1 space-y-6">
			{#await threadPromise}
				<p><T message={m['pages.blog_slug.comments.loading']} /></p>
			{:then thread}
				{#if thread.replies.length}
					{@render blueskyReplies(thread)}
					{#if thread.hasMoreReplies}
						<p class="border-outline border-t pt-1 text-right">
							<T message={m['pages.blog_slug.comments.see_all']} />
							<a class="c-link" href={postUrl} data-external> Bluesky </a>
						</p>
					{/if}
				{:else}
					<p><T message={m['pages.blog_slug.comments.empty']} url={postUrl} /></p>
				{/if}
			{/await}
		</div>

		<!-- stats & banner -->
		<div class="tablet:sticky tablet:top-header">
			<article class="@container tablet:w-64 widescreen:w-80 relative 2xl:w-96">
				<div
					class={[
						'group grid grid-cols-[auto_1fr] items-center',
						'@sm:p-6 @sm:gap-x-6 @md:p-8 @md:gap-x-10 gap-4 p-4',
						'border-onehalf bg-surface shadow-brutal border-current',
						'interactive',
					]}
				>
					<a
						class={[
							'block shrink-0',
							'i i-[simple-icons--bluesky] @xs:h-18 @xs:w-18 h-14 w-14',
							'duration-(--duration) ease-(--easing) group-hover:-rotate-20 group-hover:text-tertiary transition-[rotate,color]',
							'@xs:row-span-2',
						]}
						href={postUrl}
						data-external
					>
						<span class="sr-only">Bluesky</span>
					</a>
					<p class="font-bold">
						<T message={m['pages.blog_slug.comments.bluesky.desc']} url={postUrl} />
					</p>
					{#await threadPromise}
						<p><T message={m['pages.blog_slug.comments.bluesky.stats.loading']} /></p>
					{:then thread}
						{@render blueskyStats(
							thread.stats.like,
							thread.stats.repost,
							thread.stats.reply,
							postUrl,
						)}
						{#if thread.replies.length}
							<p class="c-text-body-sm border-outline col-span-2 border-t pt-4 leading-relaxed">
								<T message={m['pages.blog_slug.comments.bluesky.note']} url={postUrl} />
							</p>
						{/if}
					{/await}
				</div>
			</article>
		</div>
	</div>
</section>

{#snippet blueskyStats(like: number, repost: number, reply: number, url: string, small?: boolean)}
	{@const stats = { like, repost, reply }}
	<a
		class="c-link-lazy @sm:gap-6 @max-xs:col-span-2 @max-xs:justify-self-center flex flex-wrap items-center gap-4"
		href={url}
		data-external
	>
		<dl class="contents">
			{#each Object.entries(BLUESKY_STATS_CONFIG) as [key, { icon, message }] (key)}
				<div class="flex items-center gap-2">
					<dt>
						<i class={['i block', icon, small ? 'h-5 w-5' : 'h-6 w-6']}></i>
						<span class="sr-only">
							<T {message} />
						</span>
					</dt>
					<dd class={[small && 'c-text-body-sm']}>{stats[key as keyof typeof stats]}</dd>
				</div>
			{/each}
		</dl>
	</a>
{/snippet}

{#snippet blueskyReplies(aggregated: bluesky.AggregatedPost, cls = '', level = 0)}
	<ul class={cls}>
		<!-- render actual comments here -->
		{#each aggregated.replies ?? [] as reply, i (reply.post.uri)}
			{@const thread = bluesky.aggregatePostThread(reply)}
			{@const hasNext = !!aggregated.replies[i + 1] || !!thread.replies?.length}
			{@const profileUrl = `https://bsky.app/profile/${thread.post.author.did}`}
			{@const postUrl = `${profileUrl}/post/${thread.id}`}
			<li>
				<article class={['relative flex items-start gap-3', hasNext && 'pb-4']}>
					<div class="z-1 bg-surface relative shrink-0 p-1">
						<a href={profileUrl} data-external>
							<Avatar
								class="h-10 w-10 rounded-full"
								name={thread.post.author.displayName || 'What'}
								src={thread.post.author.avatar}
								height="40"
								width="40"
							/>
						</a>
					</div>
					<div class="pt-1">
						<p>
							<a class="c-link-preserved" href={profileUrl} data-external>
								<span class="font-bold">
									{thread.post.author.displayName}
								</span>
								<span class="c-text-body-sm not-hover:text-on-surface-dim">
									@{thread.post.author.handle}
								</span>
							</a>
							•
							{formatTimeDiff(thread.post.indexedAt)}
						</p>
						<p class="pb-2 pt-1">{thread.post.record.text}</p>
						{@render blueskyStats(
							thread.stats.like,
							thread.stats.repost,
							thread.stats.reply,
							postUrl,
							true,
						)}
						{#if thread.replies?.length}
							{@render blueskyReplies(thread, 'mt-6', level + 1)}
						{/if}
					</div>
					{#if level === 0 || !!thread.replies?.length}
						<div class="bg-outline-subtle left-5.5 absolute top-0 z-0 h-full w-0.5"></div>
					{/if}
					{#if level > 0}
						<div class="bg-outline-subtle top-5.5 absolute right-full z-0 h-0.5 w-9"></div>
					{/if}
					{#if level > 1 && i === aggregated.replies.length - 1}
						<div class="bg-surface -left-9.5 z-1 absolute top-6 h-full w-0.5"></div>
					{/if}
				</article>
			</li>
		{/each}
	</ul>
{/snippet}
