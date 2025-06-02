<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { BlogPostShowcase } from '$lib/components/blog-post-showcase';

	let {
		posts,
	}: {
		posts: import('svelte').ComponentProps<typeof BlogPostShowcase>['posts'];
	} = $props();
</script>

<section class="max-w-pad py-section space-y-10" data-pagefind-ignore>
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg" id="blog"><T message={m['pages.home.blog.heading']} /></h2>
		<p class="max-w-readable mx-auto"><T message={m['pages.home.blog.desc']} /></p>
	</div>
	<BlogPostShowcase {posts} />
</section>
