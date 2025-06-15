<script lang="ts">
	import { type AppBskyFeedDefs } from '@atproto/api';
	import { Toc } from '@svelte-put/toc';
	import { T } from '@sveltevietnam/i18n';
	import { onMount } from 'svelte';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import fallback16x9 from '$lib/assets/images/fallbacks/16x9.jpg?enhanced&w=2240;1540;1088;686&imagetools';
	import * as bluesky from '$lib/bluesky';
	import { Avatar } from '$lib/components/avatar';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { BlogPostListItem } from '$lib/components/blog-post-list-item';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { CopyIconBtn } from '$lib/components/copy-icon-btn';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { HintedText } from '$lib/components/hinted-text';
	import { NotByAiBadge } from '$lib/components/not-by-ai-badge';
	import { Person } from '$lib/components/person';
	import { TableOfContents } from '$lib/components/table-of-contents';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import { QrCodeDialog } from '$lib/dialogs/components/qr-code-dialog';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import * as pagefind from '$lib/pagefind/attributes';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';
	import { formatTimeDiff } from '$lib/utils/datetime';

	import type { PageData } from './$types';

	let { data }: { data: PageData } = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();
	const dialog = DialogContext.get();

	let dateFormatter = $derived(
		new Intl.DateTimeFormat(settings.language, {
			year: 'numeric',
			month: 'long',
		}),
	);

	const thumbnail = $derived(data.post.thumbnail || fallback16x9);
	const url = $derived(page.url.origin + routing.paths[settings.language]);
	const encodedUrl = $derived(encodeURIComponent(url));

	const toc = new Toc({
		selector: ':where(h2, h3, h4, h5, h6)',
		observe: {
			enabled: true,
			link: {
				activeAttribute: 'data-current',
			},
		},
	});

	function openQrDialog() {
		dialog.push('custom', {
			component: QrCodeDialog,
			props: { data: url },
		});
	}

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
	let blueskyPost = $state<AppBskyFeedDefs.ThreadViewPost | null>(null);
	onMount(async () => {
		if (!data.bluesky) return;
		const agent = bluesky.createAtpAgent(fetch);
		blueskyPost = await bluesky.getPostThread(agent, data.bluesky.uri);
	});
</script>

<main {...pagefind.page({ group: 'blog', importance: 'detail' })}>
	<!-- intro -->
	<section class="pt-intro-pad-top max-w-pad bg-gradient-primary-intro">
		<Breadcrumbs crumbs={routing.breadcrumbs} />
		<h1 class="c-text-heading-lg tablet:mt-10 desktop:mt-15 mt-8">
			{data.post.title}
		</h1>
		<p class="mt-6">{data.post.description}</p>
		<div class="tablet:mt-10 desktop:mt-15 relative mt-8">
			{#if !data.post.ai}
				<NotByAiBadge
					class="absolute -left-4 -top-4"
					--color-fg="var(--color-surface)"
					--color-bg="var(--color-on-surface)"
				/>
			{/if}
			<enhanced:img class="h-auto w-full" src={thumbnail} alt="" />
		</div>
		<div class="mt-6 space-y-4">
			<ul class="tablet:justify-end relative flex items-center gap-2">
				{#each data.post.categories as { name, slug } (slug)}
					<li class="">
						<a
							class="c-link-lazy c-text-body-sm text-on-surface-subtle hover:text-link
							hover:border-link border-outline rounded-full border px-3 py-1 leading-tight"
							href={p['/:lang/blog/categories/:slug']({ lang: settings.language, slug })}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
			<ul class="flex flex-wrap items-start gap-6">
				{#each data.post.authors as { name, id, avatar, description } (id)}
					{@const href = p['/:lang/people/:id']({ lang: settings.language, id })}
					<li>
						<Person {name} {avatar} {href} {description} />
					</li>
				{/each}
			</ul>
			<div class="bg-outline h-px w-full"></div>
			<div class="text-on-surface-subtle flex justify-between">
				<div class="space-y-2">
					<p>
						{#if data.post.translation === 'manual'}
							<T message={m['pages.blog_slug.lang.manual.title']} />
						{:else}
							<T message={m['pages.blog_slug.lang.original.title']} />
						{/if}
						<HintedText class="ml-1 cursor-help">
							<i class="i i-[ph--info] h-5 w-5"></i>
							<span class="sr-only">
								<T message={m['explain']} />
							</span>
							{#snippet hint()}
								{#if data.post.translation === 'manual'}
									<T message={m['pages.blog_slug.lang.manual.desc']} />
								{:else}
									<T message={m['pages.blog_slug.lang.original.desc']} />
								{/if}
							{/snippet}
						</HintedText>
					</p>
					<p>
						<span>
							{data.post.readMinutes}
							<T message={m['pages.blog_slug.stats.read_minutes']} />
						</span>,
						<span>
							~
							{data.post.numWords}
							<T message={m['pages.blog_slug.stats.word']} />
						</span>
					</p>
				</div>
				<p class="capitalize">{dateFormatter.format(data.post.publishedAt)}</p>
			</div>
		</div>
	</section>

	<div
		class="_container tablet:gap-8 desktop:gap-10 max-w-pad tablet:pb-15 desktop:pb-20 widescreen:gap-20 grid gap-10 py-10"
		data-hydrated={settings.hydrated}
	>
		<!-- table of contents -->
		<div class="_toc">
			{#if toc.items.size}
				<section
					class="tablet:sticky top-header mobile:border-onehalf mobile:border-dashed mobile:border-tertiary mobile:-mx-3 mobile:p-3 space-y-6"
				>
					<h2 class="c-text-heading border-outline border-b" id="toc">
						<T message={m['pages.blog_slug.headings.toc']} />
					</h2>
					<TableOfContents {toc} />
				</section>
			{/if}
		</div>

		<!-- content -->
		<section class="_content prose max-w-readable-relaxed">
			{#if data.content}
				{#key data.content}
					<div use:toc.actions.root>
						<data.content />
					</div>
				{/key}
			{/if}
			<p class="c-text-body-sm mt-6 border-t pt-2">
				<T message={m['pages.blog_slug.edit.intro']} />
				<a
					class="c-link"
					href={data.contentEditUrl}
					data-external
					data-umami-event="click-edit-page-link"
					data-umami-event-url={data.contentEditUrl}
					data-umami-event-type="post"
				>
					<T message={m['pages.blog_slug.edit.cta']} />
				</a>
			</p>
		</section>

		<!-- sharing -->
		<div class="_sharing">
			<section
				class={['space-y-6', !settings.hydrated && 'top-header sticky']}
				data-pagefind-ignore
			>
				<h2 class="c-text-heading border-b" id="share"><T message={m['pages.blog_slug.headings.share']} /></h2>
				<ul class="flex flex-wrap gap-4">
					{#if settings.hydrated}
						<li>
							<CopyIconBtn text={url} aria={m['pages.blog_slug.actions.copy'](settings.language)} />
						</li>
					{/if}
					<li>
						<a
							class="c-link-icon border-onehalf flex rounded-full border-current p-2"
							href="https://bsky.app/intent/compose?text={encodedUrl}"
							data-external
						>
							<span class="sr-only">Bluesky</span>
							<i class="i i-[ph--butterfly] h-6 w-6"></i>
						</a>
					</li>
					<li>
						<a
							class="c-link-icon border-onehalf flex rounded-full border-current p-2"
							href="https://www.facebook.com/sharer/sharer.php?u={encodedUrl}"
							data-external
						>
							<span class="sr-only">Facebook</span>
							<i class="i i-[ph--facebook-logo] h-6 w-6"></i>
						</a>
					</li>
					<li>
						<a
							class="c-link-icon border-onehalf flex rounded-full border-current p-2"
							href="https://www.linkedin.com/shareArticle?mini=true&url={encodedUrl}&title={data
								.post.title}"
							data-external
						>
							<span class="sr-only">Linkedin</span>
							<i class="i i-[ph--linkedin-logo] h-6 w-6"></i>
						</a>
					</li>
					<li>
						{#if settings.hydrated}
							<button
								class="c-link-icon border-onehalf flex rounded-full border-current p-2"
								onclick={openQrDialog}
							>
								<span class="sr-only">QR Code</span>
								<i class="i i-[ph--qr-code] h-6 w-6"></i>
							</button>
						{/if}
					</li>
				</ul>
			</section>
		</div>

		<!-- latest blog post -->
		{#if data.posts.latest}
			<section class="_latest space-y-6" data-pagefind-ignore>
				<h2 class="c-text-heading border-b" id="latest-post">
					<T message={m['pages.blog_slug.headings.latest']} />
				</h2>
				<BlogPostListItem post={data.posts.latest} />
			</section>
		{/if}
	</div>

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

	{#if data.bluesky}
		{@const aggregated = blueskyPost ? bluesky.aggregatePostThread(blueskyPost) : null}

		<!-- Bluesky comments -->
		<section
			class="max-w-pad py-section mobile:overflow-auto space-y-10"
			data-pagefind-ignore
		>
			<h2 class="c-text-heading border-outline border-b" id="comments">
				<T message={m['pages.blog_slug.comments.heading']} />
			</h2>
			<div
				class="tablet:items-start tablet:gap-8 desktop:gap-10 widescreen:gap-20 tablet:flex-row relative flex flex-col-reverse gap-10"
			>
				<!-- replies -->
				<div class="flex-1 space-y-6">
					{#if aggregated}
						{#if aggregated?.replies.length}
							{@render blueskyReplies(aggregated)}
							{#if aggregated.hasMoreReplies}
								<p class="border-outline border-t pt-1 text-right">
									<T message={m['pages.blog_slug.comments.see_all']} />
									<a class="c-link" href={data.bluesky.url} data-external> Bluesky </a>
								</p>
							{/if}
						{:else}
							<p><T message={m['pages.blog_slug.comments.empty']} url={data.bluesky.url} /></p>
						{/if}
					{:else}
						<p><T message={m['pages.blog_slug.comments.loading']} /></p>
					{/if}
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
								href={data.bluesky.url}
								data-external
							>
								<span class="sr-only">Bluesky</span>
							</a>
							<p class="font-bold">
								<T message={m['pages.blog_slug.comments.bluesky.desc']} url={data.bluesky.url} />
							</p>
							{#if aggregated}
								{@render blueskyStats(
									aggregated.stats.like,
									aggregated.stats.repost,
									aggregated.stats.reply,
									data.bluesky.url,
								)}
							{:else}
								<p><T message={m['pages.blog_slug.comments.bluesky.stats.loading']} /></p>
							{/if}
							{#if aggregated && aggregated.replies.length}
								<p class="c-text-body-sm border-outline col-span-2 border-t pt-4 leading-relaxed">
									<T message={m['pages.blog_slug.comments.bluesky.note']} url={data.bluesky.url} />
								</p>
							{/if}
						</div>
					</article>
				</div>
			</div>
		</section>
	{/if}

	<!-- newsletter -->
	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more" data-pagefind-ignore>
			<h2 class="sr-only" id="newsletter">
				<T message={m.newsletter} />
			</h2>
			<BlogNewsletter data={data.subscribeFormData} />
		</section>
	</GradientBackground>

	<!-- blog posts in same series -->
	{#if data.posts.inSeries?.length}
		<section class="py-section max-w-pad space-y-8" data-pagefind-ignore>
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title uppercase" id="in-this-series">
						<T message={m['pages.blog_slug.headings.series']} />
					</h2>
					<TextArrowLink href={p['/:lang/blog']({ lang: settings.language })}>
						<T message={m.view_more} />
					</TextArrowLink>
				</div>
			</div>
			<BlogPostCommonList posts={data.posts.inSeries} flat />
		</section>
	{/if}
</main>

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

	._container {
		grid-template-areas:
			'toc'
			'content'
			'sharing'
			'latest';
		grid-template-columns: minmax(auto, calc(100dvw - var(--pad-min-padding-x) * 2));
		grid-template-rows: repeat(4, auto);

		@media (--tablet) {
			grid-template-areas:
				'content sharing'
				'content toc'
				'content latest';
			grid-template-columns: 1fr 16rem;
			grid-template-rows: 1fr auto auto;

			&[data-hydrated]:not([data-hydrated='false']) {
				grid-template-rows: auto 1fr auto;
			}
		}

		@media (--widescreen) {
			grid-template-columns: 1fr 20rem;
		}

		@media (width >= 96rem) {
			grid-template-columns: 1fr 24rem;
		}
	}

	._toc {
		grid-area: toc;
	}

	._sharing {
		grid-area: sharing;
	}

	._content {
		grid-area: content;
	}

	._latest {
		grid-area: latest;
	}
</style>
