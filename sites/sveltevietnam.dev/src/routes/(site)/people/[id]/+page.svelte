<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import { Avatar } from '$lib/components/avatar';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { Pagination } from '$lib/components/pagination';
	import { PersonLinks } from '$lib/components/person-links';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import { RoutingContext } from '$lib/routing/context.svelte';

	let { data } = $props();

	const routing = RoutingContext.get();

	let paginationUrl = $derived.by(() => {
		const url = new URL(page.url);
		url.hash = 'posts';
		return url;
	});
</script>

<main>
	<!-- intro -->
	<section
		class="space-y-section pt-intro-pad-top from-32% from-primary-surface to-surface bg-gradient-to-b"
	>
		<div class="max-w-pad space-y-20">
			<Breadcrumbs crumbs={data.routing.breadcrumbs} />
			<div class="mobile:flex-col tablet:gap-8 desktop:gap-10 tablet:items-center flex gap-6">
				<Avatar
					class="w-25 h-25 tablet:w-40 tablet:h-40"
					src={data.person.avatar}
					name={data.person.name}
				></Avatar>
				<div class="space-y-4">
					<h1 class="c-text-heading-lg text-primary-on-surface font-bold">
						{data.person.name}
					</h1>
					<p class="c-text-subtitle-page max-w-[70ch]">{data.person.description}</p>
					<PersonLinks links={data.person.links} />
				</div>
			</div>
		</div>
		<IntroSeparator />
	</section>

	<!-- {#if data.events.length} -->
	<section class="py-section max-w-pad desktop:space-y-15 tablet:space-y-10 space-y-8">
		<div class="space-y-4 border-t-4 border-current pt-2">
			<div class="flex flex-wrap items-baseline justify-between gap-4">
				<h2 class="c-text-title">
					<T message={m['pages.people_slug.events']} name={data.person.name} />
				</h2>
				<TextArrowLink href={routing.path('events')}>
					<T message={m['pages.people_slug.view_events']} />
				</TextArrowLink>
			</div>
		</div>
	</section>
	<!-- {/if} -->

	<!-- blog post listing -->
	{#if data.posts.length}
		<section class="py-section max-w-pad desktop:space-y-15 tablet:space-y-10 space-y-8" id="posts">
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title">
						<T message={m['pages.people_slug.posts_by']} name={data.person.name} />
					</h2>
					<TextArrowLink href={routing.path('blog')}>
						<T message={m['pages.people_slug.view_blog']} />
					</TextArrowLink>
				</div>
			</div>
			<BlogPostCommonList posts={data.posts} />
			{#if data.pagination.max > 1}
				<Pagination class="ml-auto" url={paginationUrl} {...data.pagination}></Pagination>
			{/if}
		</section>
	{/if}
</main>
