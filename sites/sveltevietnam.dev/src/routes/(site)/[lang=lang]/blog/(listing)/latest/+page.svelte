<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { Pagination } from '$lib/components/pagination';
	import { RoutingContext } from '$lib/routing/context.svelte';

	let { data } = $props();

	const routing = RoutingContext.get();

	let paginationUrl = $derived.by(() => {
		const url = new URL(page.url);
		url.hash = 'listing';
		return url;
	});
</script>

<main>
	<BlogListingIntro breadcrumbs={routing.breadcrumbs}>
		{#snippet heading()}
			<T message={m['pages.blog_latest.heading']} />
		{/snippet}

		{#snippet description()}
			<T message={m['pages.blog_latest.desc']} />
		{/snippet}
	</BlogListingIntro>

	<section class="py-section max-w-pad desktop:space-y-10 space-y-8">
		<BlogPostCommonList posts={data.posts} id="listing" />
		{#if data.pagination.max > 1}
			<Pagination class="ml-auto" url={paginationUrl} {...data.pagination} />
		{/if}
	</section>

	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more" id="newsletter">
			<BlogNewsletter data={data.subscribeFormData} />
		</section>
	</GradientBackground>
</main>
