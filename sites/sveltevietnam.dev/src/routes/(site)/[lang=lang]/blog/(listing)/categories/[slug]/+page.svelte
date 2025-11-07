<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';

	import { page } from '$app/state';
	import { searchBlogPosts } from '$data/blog/posts';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { Pagination } from '$lib/components/pagination';
	import * as pagefind from '$lib/pagefind/attributes';
	import { getPaginationFromUrl } from '$lib/utils/url';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();

	let paginationUrl = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const url = new URL(page.url);
		url.hash = 'listing';
		return url;
	});
	let pagination = $derived(getPaginationFromUrl(page.url));
	let searched = $derived(
		await searchBlogPosts({
			where: { categoryId: data.category.id },
			pagination,
			lang: routing.lang,
		}),
	);
	let maxPage = $derived(Math.ceil(searched.total / pagination.per));
</script>

<main {...pagefind.page({ group: 'blog', importance: 'listing' })}>
	<BlogListingIntro
		breadcrumbs={data.routing.breadcrumbs}
		heading={data.category.name}
		description={data.category.description}
	/>

	<section class="py-section max-w-pad desktop:space-y-10 space-y-8" data-pagefind-ignore>
		<h2 class="sr-only" id="listing">
			<T key="listing" />
		</h2>
		<BlogPostCommonList posts={searched.posts} />
		{#if maxPage > 1}
			<Pagination class="ml-auto" current={pagination.page} max={maxPage} url={paginationUrl} />
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
