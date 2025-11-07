<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { formatTimeDiff } from '@sveltevietnam/kit/utilities/datetime';

	import { browser } from '$app/environment';
	import * as bluesky from '$lib/bluesky';
	import { Avatar } from '$lib/components/avatar';

	import type { BlueskyPostLinkage } from '../remotes';

	let { linkage }: { linkage?: BlueskyPostLinkage | null } = $props();

	const BLUESKY_STATS_CONFIG = {
		reply: {
			icon: 'i-[ph--chat]',
			tKey: 'pages.blog_slug.comments.bluesky.stats.reply',
		},
		repost: {
			icon: 'i-[ph--repeat]',
			tKey: 'pages.blog_slug.comments.bluesky.stats.repost',
		},
		like: {
			icon: 'i-[ph--heart]',
			tKey: 'pages.blog_slug.comments.bluesky.stats.like',
		},
	} as const;
</script>

{#if linkage}
	{@const postUrl = bluesky.buildPostUri(linkage.accountId, linkage.postId, 'http')}
	{@const threadPromise = browser
		? bluesky.getPostThread(linkage).then(bluesky.aggregatePostThread)
		: new Promise<bluesky.AggregatedPost>(() => {})}
	<section class="max-w-pad py-section mobile:overflow-auto space-y-10" data-pagefind-ignore>
		<h2 class="c-text-heading border-outline border-b" id="comments">
			<T key="pages.blog_slug.comments.heading" />
		</h2>
		<div
			class="tablet:items-start tablet:gap-8 desktop:gap-10 widescreen:gap-20 tablet:flex-row relative flex flex-col-reverse gap-10"
		>
			<!-- replies -->
			<div class="max-h-[min(75vh,50rem)] flex-1 space-y-6 overflow-auto">
				<svelte:boundary>
					{@const thread = await threadPromise}
					{#snippet pending()}
						<p><T key="pages.blog_slug.comments.loading" /></p>
					{/snippet}
					{#if thread.replies.length}
						{@render blueskyReplies(thread)}
						{#if thread.hasMoreReplies}
							<p class="border-outline border-t pt-1 text-right">
								<T key="pages.blog_slug.comments.see_all" />
								<a class="c-link" href={postUrl} data-external> Bluesky </a>
							</p>
						{/if}
					{:else}
						<p><T key="pages.blog_slug.comments.empty" params={{ url: postUrl }} /></p>
					{/if}
				</svelte:boundary>
			</div>

			<!-- stats & banner -->
			<div class="tablet:sticky tablet:top-header">
				<article class="tablet:w-64 widescreen:w-80 @container relative 2xl:w-96">
					<div
						class={[
							'group grid grid-cols-[auto_1fr] items-center',
							'gap-4 p-4 @sm:gap-x-6 @sm:p-6 @md:gap-x-10 @md:p-8',
							'border-onehalf bg-surface shadow-brutal border-current',
							'interactive',
						]}
					>
						<a
							class={[
								'block shrink-0',
								'i i-[simple-icons--bluesky] h-14 w-14 @xs:h-18 @xs:w-18',
								'group-hover:text-tertiary transition-[rotate,color] duration-(--duration) ease-(--easing) group-hover:-rotate-20',
								'@xs:row-span-2',
							]}
							href={postUrl}
							data-external
						>
							<span class="sr-only">Bluesky</span>
						</a>
						<p class="font-bold">
							<T key="pages.blog_slug.comments.bluesky.desc" params={{ url: postUrl }} />
						</p>
						<svelte:boundary>
							{@const thread = await threadPromise}
							{#snippet pending()}
								<p><T key="pages.blog_slug.comments.bluesky.stats.loading" /></p>
							{/snippet}
							{@render blueskyStats(
								thread.stats.like,
								thread.stats.repost,
								thread.stats.reply,
								postUrl,
							)}
							{#if thread.replies.length}
								<p class="c-text-body-sm border-outline col-span-2 border-t pt-4 leading-relaxed">
									<T key="pages.blog_slug.comments.bluesky.note" params={{ url: postUrl }} />
								</p>
							{/if}
						</svelte:boundary>
					</div>
				</article>
			</div>
		</div>
	</section>
{/if}

{#snippet blueskyStats(like: number, repost: number, reply: number, url: string, small?: boolean)}
	{@const stats = { like, repost, reply }}
	<a
		class="c-link-lazy flex flex-wrap items-center gap-4 @max-xs:col-span-2 @max-xs:justify-self-center @sm:gap-6"
		href={url}
		data-external
	>
		<dl class="contents">
			{#each Object.entries(BLUESKY_STATS_CONFIG) as [key, { icon, tKey }] (key)}
				<div class="flex items-center gap-2">
					<dt>
						<i class={['i block', icon, small ? 'h-5 w-5' : 'h-6 w-6']}></i>
						<span class="sr-only">
							<T key={tKey} />
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
					<div class="bg-surface z-px relative shrink-0 p-1">
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
						<p class="pt-1 pb-2">{thread.post.record.text}</p>
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
						<div class="bg-outline-subtle absolute top-0 left-5.5 z-0 h-full w-0.5"></div>
					{/if}
					{#if level > 0}
						<div class="bg-outline-subtle absolute top-5.5 right-full z-0 h-0.5 w-9"></div>
					{/if}
					{#if level > 1 && i === aggregated.replies.length - 1}
						<div class="bg-surface z-px absolute top-6 -left-9.5 h-full w-0.5"></div>
					{/if}
				</article>
			</li>
		{/each}
	</ul>
{/snippet}
