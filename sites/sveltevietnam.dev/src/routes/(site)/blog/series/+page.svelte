<script lang="ts">
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';

	let { data } = $props();

	let locales = $derived(data.locales.page as import('./_page/locales/generated').Locale);
</script>

<main>
	<BlogListingIntro
		breadcrumbs={data.routing.breadcrumbs}
		heading={locales?.page_heading}
		description={locales?.page_description}
	></BlogListingIntro>
</main>
