<script lang="ts">
	import { Toc } from '@svelte-put/toc';
	import { T } from '@sveltevietnam/i18n-new';
	import type { Key } from '@sveltevietnam/i18n-new/generated';
	import fallback16x9 from '@sveltevietnam/kit/assets/images/fallbacks/16x9.jpg?enhanced&w=2240;1540;1088;686&imagetools';
	import { Breadcrumbs, CopyBtn, NotByAiBadge } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { DialogQrCode } from '@sveltevietnam/kit/dialogs';
	import { formatRelativeTime } from '@sveltevietnam/kit/utilities/datetime';

	import { page } from '$app/state';
	import * as p from '$data/routes/generated';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { BlogPostListItem } from '$lib/components/blog-post-list-item';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { HintedText } from '$lib/components/hinted-text';
	import { Person } from '$lib/components/person';
	import { TableOfContents } from '$lib/components/table-of-contents';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import * as pagefind from '$lib/pagefind/attributes';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageProps } from './$types';
	import BlueskyComments from './_page/components/BlueskyComments.svelte';

	let { data }: PageProps = $props();

	const { routing, dialogs, colorScheme } = Contexts.get();
	const settings = SettingsContext.get();

	let dateFormatter = $derived(
		new Intl.DateTimeFormat(routing.lang, {
			year: 'numeric',
			month: 'long',
		}),
	);

	const thumbnail = $derived(data.post.thumbnail || fallback16x9);
	const url = $derived(page.url.origin + routing.paths[routing.lang]);
	const encodedUrl = $derived(encodeURIComponent(url));
	const outdated = $derived.by(() => {
		if (!data.post.outdate) return null;
		const elapsedMs = data.post.publishedAt.getTime() - Date.now();
		if (data.post.outdate === true) return formatRelativeTime(routing.lang, elapsedMs);
		if (typeof data.post.outdate === 'number') {
			const outdateMs = data.post.outdate * 24 * 60 * 60 * 1000;
			if (Math.abs(elapsedMs) >= outdateMs) return formatRelativeTime(routing.lang, elapsedMs);
			return null;
		}
		if (data.post.outdate.getTime() <= Date.now())
			return formatRelativeTime(routing.lang, elapsedMs);
		return null;
	});

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
		dialogs.push('custom', {
			component: DialogQrCode,
			props: {
				data: url,
				theme: () => colorScheme.resolved,
			},
		});
	}

	let containerEl: HTMLDivElement | undefined = $state(undefined);
	let showQuickNav = $state(false);
	function onScroll() {
		if (!containerEl) return;
		showQuickNav = window.scrollY > containerEl.offsetTop;
	}
</script>

<svelte:window onscroll={onScroll} />

<main {...pagefind.page({ group: 'blog', importance: 'detail' })}>
	<!-- intro -->
	<section class="pt-intro-pad-top max-w-pad bg-gradient-primary-intro">
		<Breadcrumbs crumbs={data.routing.breadcrumbs} />
		<h1 class="c-text-heading-lg tablet:mt-10 desktop:mt-15 mt-8">
			{data.post.title}
		</h1>
		<p class="mt-6">{data.post.description}</p>
		<div class="tablet:mt-10 desktop:mt-15 relative mt-8">
			{#if !data.post.ai}
				<NotByAiBadge
					class="absolute -top-4 -left-4"
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
							href={p['/:lang/blog/categories/:slug']({ lang: routing.lang, slug })}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
			<ul class="flex flex-wrap items-start gap-6">
				{#each data.post.authors as { name, id, avatar, description } (id)}
					{@const href = p['/:lang/people/:id']({ lang: routing.lang, id })}
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
							<T key="pages.blog_slug.lang.manual.title" />
						{:else}
							<T key="pages.blog_slug.lang.original.title" />
						{/if}
						<HintedText class="ml-1 cursor-help">
							<i class="i i-[ph--info] h-5 w-5"></i>
							<span class="sr-only">
								<T key="explain" />
							</span>
							{#snippet hint()}
								{#if data.post.translation === 'manual'}
									<T key="pages.blog_slug.lang.manual.desc" />
								{:else}
									<T key="pages.blog_slug.lang.original.desc" />
								{/if}
							{/snippet}
						</HintedText>
					</p>
					<p>
						<span>
							{data.post.readMinutes}
							<T key="pages.blog_slug.stats.read_minutes" />
						</span>,
						<span>
							~
							{data.post.numWords}
							<T key="pages.blog_slug.stats.word" />
						</span>
					</p>
				</div>
				<p class="capitalize">{dateFormatter.format(data.post.publishedAt)}</p>
			</div>
		</div>
	</section>

	<!-- quick navigation -->
	<div
		class="z-overlay mobile:inset-x-0 tablet:left-1/2 tablet:-translate-x-1/2 fixed bottom-0"
		data-pagefind-ignore
	>
		<nav
			class={[
				'bg-on-surface text-surface tablet:border-surface tablet:border-onehalf mobile:justify-evenly _quick-nav flex items-center px-2',
				showQuickNav ? 'translate-y-0' : 'translate-y-16',
			]}
			aria-labelledby="quick-nav-label"
		>
			<span class="sr-only" id="quick-nav-label">
				<T key="pages.blog_slug.quick_nav.aria" />
			</span>
			{#snippet inlink(href: string, tKey: Key, iconClass: string)}
				<a
					class="c-link-lazy flex flex-col items-center justify-end gap-2 p-2"
					{href}
					style:--active-color="var(--color-primary)"
				>
					<i class={['i h-6 w-6', iconClass]}></i>
					<span class="sr-only"> <T key={tKey} /> </span>
				</a>
			{/snippet}
			<ul class="contents">
				<li>
					{@render inlink('#share', 'pages.blog_slug.quick_nav.share', 'i-[ph--share-fat]')}
				</li>
				<li class="pr-8">
					{@render inlink(
						'#toc',
						'pages.blog_slug.quick_nav.toc',
						'i-[ph--list-magnifying-glass]',
					)}
				</li>
				<li class="absolute top-0 left-1/2 -translate-1/2">
					<a
						class="c-link-lazy bg-on-surface relative flex flex-col items-center justify-end gap-2 rounded-full p-2"
						href="#content"
						style:--active-color="var(--color-primary)"
					>
						<span
							class="bg-surface absolute top-1/2 -right-1 bottom-0 -left-1 -z-1 h-[calc(50%+0.25rem)] rounded-b-full"
						></span>
						<i class="i i-[ph--caret-up] h-6 w-6"></i>
						<span class="sr-only">
							<T key="pages.blog_slug.quick_nav.scroll" />
						</span>
					</a>
				</li>
				<li class="pl-8">
					{#if data.posts.inSeries?.length}
						{@render inlink(
							'#in-this-series',
							'pages.blog_slug.quick_nav.series',
							'i-[ph--files]',
						)}
					{:else}
						{@render inlink('#latest-post', 'pages.blog_slug.quick_nav.latest', 'i-[ph--files]')}
					{/if}
				</li>
				<li>
					{@render inlink(
						'#newsletter',
						'pages.blog_slug.quick_nav.newsletter',
						'i-[ph--newspaper-clipping]',
					)}
				</li>
			</ul>
		</nav>
	</div>

	<div
		class="_container tablet:gap-8 desktop:gap-10 max-w-pad tablet:pb-15 desktop:pb-20 widescreen:gap-20 grid gap-10 py-10"
		bind:this={containerEl}
		data-hydrated={settings.hydrated}
	>
		<!-- table of contents -->
		<div class="_toc">
			{#if toc.items.size}
				<section
					class="tablet:sticky top-header mobile:border-onehalf mobile:border-dashed mobile:border-tertiary mobile:-mx-3 mobile:p-3 space-y-6"
				>
					<h2 class="c-text-heading border-outline border-b" id="toc">
						<T key="pages.blog_slug.headings.toc" />
					</h2>
					<TableOfContents {toc} />
				</section>
			{/if}
		</div>

		<!-- content -->
		<section class="_content prose max-w-readable-relaxed" id="content">
			{#if outdated}
				<p class="c-callout c-callout--warning">
					<T key="pages.blog_slug.outdated" params={{age: outdated}} />
				</p>
			{/if}
			{#if data.content}
				{#key data.content}
					<div use:toc.actions.root>
						<data.content />
					</div>
				{/key}
			{/if}
			<p class="c-text-body-sm mt-6 border-t pt-2">
				<T key="pages.blog_slug.edit.intro" />
				<a
					class="c-link"
					href={data.contentEditUrl}
					data-external
					data-umami-event="click-edit-page-link"
					data-umami-event-url={data.contentEditUrl}
					data-umami-event-type="post"
				>
					<T key="pages.blog_slug.edit.cta" />
				</a>
			</p>
		</section>

		<!-- sharing -->
		<div class="_sharing">
			<section
				class={['space-y-6', !settings.hydrated && 'top-header sticky']}
				data-pagefind-ignore
			>
				<h2 class="c-text-heading border-b" id="share">
					<T key="pages.blog_slug.headings.share" />
				</h2>
				<ul class="flex flex-wrap gap-4">
					{#if settings.hydrated}
						<li>
							<CopyBtn
								class="c-link-icon border-onehalf flex rounded-full border-current p-2"
								textToCopy={url}
								aria="pages.blog_slug.actions.copy"
							/>
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
								type="button"
								class="c-link-icon border-onehalf flex rounded-full border-current p-2"
								onclick={openQrDialog}
							>
								<span class="sr-only">QR Code</span>
								<i class="i i-[ph--qr-code] h-6 w-6"></i>
							</button>
						{/if}
					</li>
				</ul>
				<p class="border-onehalf shadow-brutal-sm border-current p-4">
					<T key="pages.blog_slug.write" />
				</p>
			</section>
		</div>

		<!-- latest blog post -->
		{#if data.posts.latest}
			<section class="_latest space-y-6" data-pagefind-ignore>
				<h2 class="c-text-heading border-b" id="latest-post">
					<T key="pages.blog_slug.headings.latest" />
				</h2>
				<BlogPostListItem post={data.posts.latest} />
			</section>
		{/if}
	</div>

	<!-- Bluesky comments -->
	{#if data.bluesky}
		<BlueskyComments {...data.bluesky} />
	{/if}

	<!-- newsletter -->
	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more" data-pagefind-ignore>
			<h2 class="sr-only" id="newsletter">
				<T key="newsletter" />
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
						<T key="pages.blog_slug.headings.series" />
					</h2>
					<TextArrowLink href={p['/:lang/blog']({ lang: routing.lang })}>
						<T key="view_more" />
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

	._quick-nav {
		transition-timing-function: var(--default-transition-timing-function);
		transition-duration: 250ms;
		transition-property: clip-path, translate;

		@media (--tablet) {
			clip-path: circle(1.25rem at 50% 1.25px);

			&:hover {
				clip-path: circle(10rem at 50% 0);
				transition-duration: 150ms;
			}
		}
	}
</style>
