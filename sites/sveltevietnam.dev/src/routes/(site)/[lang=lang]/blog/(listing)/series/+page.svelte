<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as p from '$data/routes/generated';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';
	import { BlogPostCollectionListItem } from '$lib/components/blog-post-collection-list-item';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
</script>

<main {...pagefind.page({ group: 'blog', importance: 'other' })}>
	<BlogListingIntro breadcrumbs={data.routing.breadcrumbs}>
		{#snippet heading()}
			<T key="pages.blog_series.heading" />
		{/snippet}

		{#snippet description()}
			<T key="pages.blog_series.desc" />
		{/snippet}
	</BlogListingIntro>

	<section class="py-section max-w-pad" data-pagefind-ignore>
		<h2 class="sr-only" id="listing">
			<T key="listing" />
		</h2>
		<ul class="tablet:space-y-10 space-y-8 divide-y">
			{#each data.series as series (series.id)}
				{@const href = p['/:lang/blog/series/:slug']({
					lang: routing.lang,
					slug: series.slug,
				})}
				<li class="not-last:pb-8 tablet:not-last:pb-10 @container">
					<BlogPostCollectionListItem
						type="series"
						name={series.name}
						description={series.description}
						thumbnail={series.thumbnail}
						{href}
					/>
				</li>
			{/each}
		</ul>
	</section>
</main>
