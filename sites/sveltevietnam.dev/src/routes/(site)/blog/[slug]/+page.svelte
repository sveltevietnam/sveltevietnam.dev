<script lang="ts">
	import { Toc } from '@svelte-put/toc';
	import { T } from '@sveltevietnam/i18n';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import fallback16x9 from '$lib/assets/images/fallbacks/16x9.jpg?enhanced&w=2240,1540;1088;686&imagetools';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { BlogPostListItem } from '$lib/components/blog-post-list-item';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { CopyIconBtn } from '$lib/components/copy-icon-btn';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { HintedText } from '$lib/components/hinted-text';
	import { NotByAiBadge } from '$lib/components/not-by-ai-badge';
	import { Person } from '$lib/components/person';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import { QrCodeDialog } from '$lib/dialogs/qr-code-dialog';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { data } = $props();

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
	const url = $derived(page.url.origin + data.routing.paths[settings.language].path);
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
</script>

<main>
	<!-- intro -->
	<section class="pt-intro-pad-top max-w-pad bg-gradient-primary-intro">
		<Breadcrumbs crumbs={data.routing.breadcrumbs} />
		<h1 class="c-text-heading-lg tablet:mt-10 desktop:mt-15 mt-8">
			{data.post.title}
		</h1>
		<p class="mt-6">{data.post.description}</p>
		<div class="tablet:mt-10 desktop:mt-15 relative mt-8">
			<NotByAiBadge
				class="absolute -left-4 -top-4"
				--color-fg="var(--color-surface)"
				--color-bg="var(--color-on-surface)"
			/>
			<enhanced:img class="h-auto w-full" src={thumbnail} alt="" />
		</div>
		<div class="mt-6 space-y-4">
			<ul class="tablet:justify-end relative flex items-center gap-2">
				{#each data.post.categories as { name, slug } (slug)}
					<li class="">
						<a
							class="c-link-lazy c-text-body-sm text-on-surface-subtle hover:text-link
							hover:border-link border-outline rounded-full border px-3 py-1 leading-tight"
							href={routing.path('blog/categories/:category', slug)}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
			<ul class="flex flex-wrap items-start gap-6">
				{#each data.post.authors as { name, id, avatar, description } (id)}
					{@const href = routing.path('people/:id', id)}
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
							<i class="i i-[info] h-5 w-5"></i>
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
				<section class="tablet:sticky top-header space-y-6" id="toc">
					<h2 class="c-text-heading border-b"><T message={m['pages.blog_slug.headings.toc']} /></h2>
					<ul class="space-y-1">
						{#each toc.items.values() as tocItem (tocItem.id)}
							{@const level = tocItem.element.tagName.slice(1)}
							<li>
								<!-- svelte-ignore a11y_missing_attribute -->
								<a
									use:toc.actions.link={tocItem}
									class="c-link-lazy current:text-link block py-1 capitalize"
									style:padding-left="calc(({level} - 2) * 1ch)"
								>
									<!-- textContent injected by toc -->
								</a>
							</li>
						{/each}
					</ul>
				</section>
			{/if}
		</div>

		<!-- content -->
		<section class="_content prose max-w-full">
			{#if data.content}
				{#key data.content}
					<div use:toc.actions.root>
						<data.content />
					</div>
				{/key}
			{/if}
			<p class="c-text-body-sm mt-6 border-t pt-2">
				<T message={m['pages.blog_slug.edit.intro']} />
				<a class="c-link" href={data.contentEditUrl} data-external>
					<T message={m['pages.blog_slug.edit.cta']} />
				</a>
			</p>
		</section>

		<!-- sharing -->
		<div class="_sharing">
			<section class={['space-y-6', !settings.hydrated && 'top-header sticky']} id="share">
				<h2 class="c-text-heading border-b"><T message={m['pages.blog_slug.headings.share']} /></h2>
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
							<i class="i i-[butterfly] h-6 w-6"></i>
						</a>
					</li>
					<li>
						<a
							class="c-link-icon border-onehalf flex rounded-full border-current p-2"
							href="https://www.facebook.com/sharer/sharer.php?u={encodedUrl}"
							data-external
						>
							<span class="sr-only">Facebook</span>
							<i class="i i-[facebook-logo] h-6 w-6"></i>
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
							<i class="i i-[linkedin-logo] h-6 w-6"></i>
						</a>
					</li>
					<li>
						{#if settings.hydrated}
							<button
								class="c-link-icon flex rounded-full border-onehalf border-current p-2"
								onclick={openQrDialog}
							>
								<span class="sr-only">QR Code</span>
								<i class="i i-[qr-code] h-6 w-6"></i>
							</button>
						{/if}
					</li>
				</ul>
			</section>
		</div>

		<!-- latest blog post -->
		{#if data.posts.latest}
			<section class="_latest space-y-6">
				<h2 class="c-text-heading border-b">
					<T message={m['pages.blog_slug.headings.latest']} />
				</h2>
				<BlogPostListItem post={data.posts.latest} />
			</section>
		{/if}
	</div>

	<!-- newsletter -->
	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more" id="newsletter">
			<BlogNewsletter />
		</section>
	</GradientBackground>

	<!-- blog posts in same series -->
	{#if data.posts.inSeries?.length}
		<section class="py-section max-w-pad space-y-8" id="posts">
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title uppercase">
						<T message={m['pages.blog_slug.headings.series']} />
					</h2>
					<TextArrowLink href={routing.path('blog')}>
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
		grid-template-columns: 1fr;
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
