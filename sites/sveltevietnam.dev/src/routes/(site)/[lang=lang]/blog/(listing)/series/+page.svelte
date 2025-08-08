<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';
	import { BlogPostCollectionListItem } from '$lib/components/blog-post-collection-list-item';
	import * as pagefind from '$lib/pagefind/attributes';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const settings = SettingsContext.get();
	const routing = RoutingContext.get();
</script>

<main {...pagefind.page({ group: 'blog', importance: 'other' })}>
	<BlogListingIntro breadcrumbs={routing.breadcrumbs}>
		{#snippet heading()}
			<T message={m['pages.blog_series.heading']} />
		{/snippet}

		{#snippet description()}
			<T message={m['pages.blog_series.desc']} />
		{/snippet}
	</BlogListingIntro>

	<section class="py-section max-w-pad" data-pagefind-ignore>
		<h2 class="sr-only" id="listing">
			<T message={m.listing} />
		</h2>
		<ul class="tablet:space-y-10 space-y-8 divide-y">
			{#each data.series as series (series.id)}
				{@const href = p['/:lang/blog/series/:slug']({
					lang: settings.language,
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
