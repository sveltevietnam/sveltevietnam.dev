<script lang="ts">
	import { page } from '$app/state';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { GradientBackground } from '$lib/components/gradient-background';
	import Pagination from '$lib/components/pagination/Pagination.svelte';

	let { data } = $props();

	let paginationUrl = $derived.by(() => {
		const url = new URL(page.url);
		url.hash = 'listing';
		return url;
	});
</script>

<section class="py-section max-w-pad space-y-8 desktop:space-y-10">
	<BlogPostCommonList posts={data.posts} id="listing" />
	<Pagination
		class="ml-auto"
		locale={data.locales.pagination}
		current={data.page}
		total={data.total}
		url={paginationUrl}
	></Pagination>
</section>

<GradientBackground pattern="jigsaw">
	<section class="max-w-pad pt-section pb-section-more" id="newsletter">
		<BlogNewsletter locale={data.locales.blogNewsletter} />
	</section>
</GradientBackground>

