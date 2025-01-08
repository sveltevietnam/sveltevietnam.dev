<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { BlogPostLatestList } from '$lib/components/blog-post-latest-list';

	let {
		locale,
		posts,
	}: {
		locale: import('./locales/generated').Locale;
		posts: import('svelte').ComponentProps<typeof BlogPostLatestList>['posts'];
	} = $props();
</script>

<section class="max-w-pad py-section space-y-10">
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg"><T message={locale.heading} /></h2>
		<p class="mx-auto max-w-[70ch]"><T message={locale.description} /></p>
	</div>
	<BlogPostLatestList {posts} />
</section>
