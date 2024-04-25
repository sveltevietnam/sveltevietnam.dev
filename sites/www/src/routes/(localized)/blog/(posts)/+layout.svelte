<script lang="ts">
	import { copy } from '@svelte-put/copy';
	import { toc, toclink, createTocStore } from '@svelte-put/toc';
	import { fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import { intersect } from '$lib/actions/intersect';
	import fallbackThumbnail from '$lib/assets/images/fallback/16x9.jpg?w=2000&enhanced&imagetools';
	import { BlogPostListItem } from '$lib/components/BlogPostListItem';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import ExternalBlogPostListItem from '$lib/components/ExternalBlogPostListItem/ExternalBlogPostListItem.svelte';
	import { Person } from '$lib/components/Person';
	import { getLangContext } from '$lib/contexts/lang';
	import { modalStore } from '$lib/modals';
	import type { Breadcrumb } from '$lib/routing/routing.server';
	import { textTip } from '$lib/tooltips';
	import { formateDateForBlog } from '$lib/utils/datetime';

	import MailSection from '../_page/components/MailSection.svelte';

	import type { LayoutData } from './$types';

	export let data: LayoutData;

	const { lang } = getLangContext();

	$: meta = $page.data.meta;
	$: post = $page.data.post;
	$: isLangNotSupported = !$page.data.supportedLanguages?.includes($lang);
	$: breadcrumbs = [...data.breadcrumbs, { label: post?.title ?? '' }] satisfies Breadcrumb[];

	$: encodedCanonical = encodeURIComponent(meta?.canonical ?? '');
	$: encodedTitle = encodeURIComponent(post?.title ?? '');

	$: t = data.translations.layout;

	let copyTimeoutId: ReturnType<typeof setTimeout>;
	let copied = false;
	function onCopiedCanonical() {
		copied = true;
	}
	function onMouseEnterCopyButton() {
		clearTimeout(copyTimeoutId);
	}
	function onMouseLeaveCopyButton() {
		copyTimeoutId = setTimeout(() => {
			copied = false;
		}, 1800);
	}

	const tocStore = createTocStore();

	async function onClickQRLink() {
		modalStore.push({
			component: (await import('$lib/modals/QRCode')).QRCode,
			props: {
				data: meta?.canonical ?? '',
				texts: {
					...t.qr,
					filename: post?.slug ?? 'qr',
				},
			},
		});
	}

	$: langVersion =
		$lang === post?.originalLang || isLangNotSupported
			? t.language.original
			: t.language.translated;
	let stats = '';
	$: {
		stats = '';
		if (post?.readMinutes) {
			stats += `${post.readMinutes} ${t.readMinutes}`;
		}
		if (post?.wordCount) {
			if (stats) stats += ', ';
			stats += `~${post.wordCount} ${t.word}`;
		}
	}
</script>

<main class="max-w-pad">
	<Breadcrumbs {breadcrumbs} class="mt-6" />
	<article class="mt-8 tb:mt-[60px]">
		<section>
			<div class="relative">
				{#if post?.thumbnail}
					<enhanced:img src={post?.thumbnail} alt={post?.title} class="h-auto w-full" />
				{:else}
					<enhanced:img src={fallbackThumbnail} alt={post?.title} class="h-auto w-full" />
				{/if}
				<a
					href="https://notbyai.fyi"
					class="absolute -left-3 -top-3 text-grayscale-black hover:text-orange-700"
				>
					<svg inline-src="not-by-ai" height="40" width="123" class="fill-grayscale-white" />
				</a>
			</div>
			<div class="mt-8 space-y-6">
				<div>
					{#if post?.series}
						<p class="c-text-cap1 mb-1 text-green-900 dark:text-green-300">
							— {post.series.map((s) => s.title).join(', ')}
						</p>
					{/if}
					<h1 class="c-text-h2 font-bold">{post?.title}</h1>
				</div>
				<ul class="flex flex-wrap items-center gap-2">
					{#each post?.tags ?? [] as tag}
						<li class="c-tag">{tag}</li>
					{/each}
				</ul>
				<!-- <div class="separator" /> -->
				<ul class="flex items-start gap-6">
					{#each post?.authors ?? [] as person}
						<li>
							<Person {person} />
						</li>
					{/each}
				</ul>
				<div class="c-text-cap1 text-fg-200">
					<div class="mb-2 separator" />
					<div class="c-text-cap1 flex justify-between text-fg-200">
						<div class="shrink-0">
							{#key langVersion}
								<p>
									{langVersion.label}
									<svg
										inline-src="lucide/info"
										class="ml-1 inline-block cursor-help align-text-top"
										stroke-width="1.5"
										height="16"
										width="16"
										use:textTip={{ content: langVersion.description }}
									/>
								</p>
							{/key}
							{#if stats}
								<p class="mt-1">
									{stats}
								</p>
							{/if}
						</div>
						{#if post?.date}
							<p class="flex-1 shrink-0 text-right">
								{formateDateForBlog($lang, post?.date)}
							</p>
						{/if}
					</div>
				</div>
			</div>
		</section>

		{#if isLangNotSupported}
			<p class="c-callout c-callout--warning mt-[60px]">
				{@html t.language.unsupported}
			</p>
		{/if}

		<div class="post-grid mt-[60px]">
			{#key $lang && $page.url.pathname}
				<section
					class="post-content prose max-w-full dark:prose-invert"
					use:toc={{
						store: tocStore,
						selector: ':where(h2,h3,h4,h5,h6)',
						observe: true,
					}}
				>
					<slot />
					<hr />
					<p class="c-text-body2">
						{t.editLink.intro}
						<a href={post?.githubUrl} external>{t.editLink.label}</a>
					</p>
				</section>
			{/key}

			<section class="post-latest">
				<h2 class="font-medium sp:c-text-h2@sp tb:c-text-h3@pc after:mt-2 after:separator">
					{t.latest}
				</h2>
				<ul class="mt-8 space-y-8">
					{#each data.latest.internal as post}
						<li class="before:mb-8 before:separator first-of-type:before:hidden">
							<BlogPostListItem {post} alwaysVertical />
						</li>
					{/each}
					{#each data.latest.external as post}
						<li class="before:mb-8 before:separator">
							<ExternalBlogPostListItem {post} />
						</li>
					{/each}
				</ul>
			</section>

			<section class="post-share">
				<h2 class="sp:c-text-h2@sp tb:c-text-h3@pc after:mt-2 after:separator" id="share">
					{t.share}
				</h2>
				<ul class="mt-8 flex flex-wrap items-center gap-4">
					<li>
						<a
							href="https://www.facebook.com/sharer/sharer.php?u={encodedCanonical}"
							class="c-link c-link--icon block w-fit rounded-full border border-current p-[10px]"
							external
						>
							<span class="sr-only">facebook</span>
							<svg inline-src="lucide/facebook" width="20" height="20" stroke-width="1.5" />
						</a>
					</li>
					<li>
						<a
							href="https://twitter.com/intent/tweet?url={encodedCanonical}&text={encodedTitle}"
							class="c-link c-link--icon block w-fit rounded-full border border-current p-[10px]"
							external
						>
							<span class="sr-only">twitter (x)</span>
							<svg inline-src="lucide/twitter" width="20" height="20" stroke-width="1.5" />
						</a>
					</li>
					<li>
						<a
							href="https://www.linkedin.com/shareArticle?mini=true&url={encodedCanonical}&title={encodedTitle}"
							class="c-link c-link--icon block w-fit rounded-full border border-current p-[10px]"
							external
						>
							<span class="sr-only">linkedin</span>
							<svg inline-src="lucide/linkedin" width="20" height="20" stroke-width="1.5" />
						</a>
					</li>
					<li>
						<button
							class="c-link c-link--icon block w-fit rounded-full border border-current p-[10px]"
							on:copied={onCopiedCanonical}
							on:mouseleave={onMouseLeaveCopyButton}
							on:mouseenter={onMouseEnterCopyButton}
							use:copy={{ text: meta?.canonical ?? '' }}
						>
							<span class="sr-only">copy link</span>
							{#if copied}
								<svg
									inline-src="lucide/clipboard-check"
									width="20"
									height="20"
									stroke-width="1.5"
									in:fly={{ duration: 200, y: 10 }}
								/>
							{:else}
								<svg
									inline-src="lucide/link"
									width="20"
									height="20"
									stroke-width="1.5"
									in:fly={{ duration: 200, y: -10 }}
								/>
							{/if}
						</button>
					</li>
					<li>
						<button
							class="c-link c-link--icon block w-fit rounded-full border border-current p-[10px]"
							on:click={onClickQRLink}
						>
							<span class="sr-only">QR code</span>
							<svg inline-src="lucide/qr-code" width="20" height="20" stroke-width="1.5" />
						</button>
					</li>
				</ul>
			</section>

			<section class="post-toc">
				{#if $tocStore.items.size}
					<nav aria-label={t.tableOfContents.title}>
						<h2
							class="font-medium sp:c-text-h2@sp tb:c-text-h3@pc after:mt-2 after:separator"
							id="toc"
						>
							{t.tableOfContents.title}
						</h2>
						<ul class="mt-8">
							{#each $tocStore.items.values() as tocItem (tocItem.id)}
								{@const level = tocItem.element.tagName.slice(1)}
								<li>
									<!-- svelte-ignore a11y-missing-attribute -->
									<a
										use:toclink={{
											tocItem,
											store: tocStore,
											observe: {
												attribute: 'data-current',
											},
										}}
										class="my-2 block tb:data-current:text-link"
										class:ml-4={level === '3'}
										class:ml-8={level === '4'}
										class:ml-12={level === '5'}
										class:ml-16={level === '6'}
									>
										<span class="c-link c-link--preserved">
											{tocItem.text}
										</span>
									</a>
								</li>
							{/each}
						</ul>
					</nav>
				{/if}
			</section>
		</div>
	</article>

	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<section use:intersect>
			<MailSection mailT={data.mail.translation} mailForm={data.mail.form} />
		</section>

		{#if data.inSeries.length}
			<section class="space-y-10">
				<h2 class="c-text-h2 font-medium after:mt-2 after:separator" use:intersect>{t.series}</h2>
				{#each data.inSeries as posts}
					<ul class="blog-subgrid-list">
						{#each posts as post}
							<li use:intersect>
								<BlogPostListItem {post} alwaysVertical />
							</li>
						{/each}
					</ul>
				{/each}
			</section>
		{/if}
	</div>
</main>

<style lang="postcss">
	.post-grid {
		position: relative;

		display: grid;
		grid-template-areas:
			'toc'
			'content'
			'share'
			'latest';
		grid-template-columns: minmax(0, 1fr);
		grid-template-rows: repeat(4, auto);
		row-gap: 60px;

		@screen tb {
			grid-template-areas:
				'content share'
				'content toc'
				'content latest';
			grid-template-columns: minmax(400px, 3fr) minmax(200px, 1fr);
			grid-template-rows: auto 1fr auto;
			column-gap: 60px;
		}
	}

	.post-content {
		grid-area: content;

		& :global(img) {
			max-width: 100%;
		}
	}

	.post-share {
		grid-area: share;
		height: fit-content;
	}

	.post-latest {
		grid-area: latest;
		height: fit-content;
	}

	.post-toc {
		grid-area: toc;

		& nav {
			@screen tb {
				position: sticky;
				top: calc(var(--header-height) + 60px);
			}
		}
	}
</style>
