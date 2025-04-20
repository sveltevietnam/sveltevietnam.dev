<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';

	let { data } = $props();
</script>

<main>
	<BlogListingIntro breadcrumbs={data.routing.breadcrumbs}>
		{#snippet heading()}
			<T message={m['pages.blog_categories.heading']} />
		{/snippet}

		{#snippet description()}
			<T message={m['pages.blog_categories.desc']} />
		{/snippet}
	</BlogListingIntro>
</main>
