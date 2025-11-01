<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { page } from '$app/state';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { Pagination } from '$lib/components/pagination';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	let paginationUrl = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const url = new URL(page.url);
		url.hash = 'listing';
		return url;
	});
</script>

<main {...pagefind.page({ group: 'blog', importance: 'listing' })}>
	<BlogListingIntro breadcrumbs={data.routing.breadcrumbs}>
		{#snippet heading()}
			<T key="pages.blog_latest.heading" />
		{/snippet}

		{#snippet description()}
			<T key="pages.blog_latest.desc" />
		{/snippet}
	</BlogListingIntro>

	<section class="py-section max-w-pad desktop:space-y-10 space-y-8" data-pagefind-ignore>
		<h2 class="sr-only" id="listing">
			<T key="listing" />
		</h2>
		<BlogPostCommonList posts={data.posts} />
		{#if data.pagination.max > 1}
			<Pagination class="ml-auto" url={paginationUrl} {...data.pagination} />
		{/if}
	</section>

	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more" data-pagefind-ignore>
			<h2 class="sr-only" id="newsletter">
				<T key="newsletter" />
			</h2>
			<BlogNewsletter data={data.subscribeFormData} />
		</section>
	</GradientBackground>
</main>
