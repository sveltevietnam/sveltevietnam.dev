<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { BlogListingIntro } from '$lib/components/blog-listing-intro';
	import { BlogPostCollectionListItem } from '$lib/components/blog-post-collection-list-item';
	import * as pagefind from '$lib/pagefind/attributes';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const settings = SettingsContext.get();
</script>

<main {...pagefind.page({ group: 'blog', importance: 'other' })}>
	<BlogListingIntro breadcrumbs={data.routing.breadcrumbs}>
		{#snippet heading()}
			<T message={m['pages.blog_categories.heading']} />
		{/snippet}

		{#snippet description()}
			<T message={m['pages.blog_categories.desc']} />
		{/snippet}
	</BlogListingIntro>

	<section class="py-section max-w-pad" data-pagefind-ignore>
		<h2 class="sr-only" id="listing">
			<T message={m.listing} />
		</h2>
		<ul class="tablet:space-y-10 space-y-8 divide-y">
			{#each data.categories as category (category.id)}
				{@const href = p['/:lang/blog/categories/:slug']({
					lang: settings.language,
					slug: category.slug,
				})}
				<li class="not-last:pb-8 tablet:not-last:pb-10 @container">
					<BlogPostCollectionListItem
						type="category"
						name={category.name}
						description={category.description}
						thumbnail={category.thumbnail}
						{href}
					/>
				</li>
			{/each}
		</ul>
	</section>
</main>
