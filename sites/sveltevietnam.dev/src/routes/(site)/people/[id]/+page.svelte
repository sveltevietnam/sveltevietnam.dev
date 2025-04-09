<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { EventListing } from '$lib/components/event-listing';
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
	<section class="group overflow-hidden">
		<div class="max-w-pad tablet:gap-10 tablet:flex-row flex flex-col">
			<div
				class={[
					'z-1 tablet:space-y-8 pt-intro-pad-top relative flex-1 space-y-6',
					!data.person.popImage && 'pb-section',
				]}
			>
				<Breadcrumbs crumbs={data.routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-lg text-primary-on-surface font-bold">
						{data.person.name}
					</h1>
					<p class="c-text-subtitle-page max-w-[70ch]">{data.person.description}</p>
					<PersonLinks links={data.person.links} />
				</div>
			</div>
			{#if data.person.popImage}
				<div
					class="tablet:pt-intro-pad-top tablet:px-6 desktop:px-10 can-hover:grayscale duration-400
					self-end transition-[filter] group-hover:filter-none group-hover:duration-75"
				>
					<enhanced:img
						class="tablet:w-70 desktop:w-80 can-hover:translate-y-6 can-hover:scale-90
						duration-400 relative h-auto w-60 transition-transform
						group-hover:translate-y-0 group-hover:scale-100 group-hover:duration-75"
						src={data.person.popImage}
						alt=""
					/>
				</div>
			{/if}
		</div>
		<IntroSeparator variant="full" class="z-2 relative" />
	</section>

	{#if data.events.length}
		<section class="py-section max-w-pad desktop:space-y-15 tablet:space-y-10 space-y-8">
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title">
						<T message={m['pages.people_slug.events']} name={data.person.name} />
					</h2>
					<TextArrowLink class="ml-auto" href={routing.path('events')}>
						<T message={m['pages.people_slug.view_events']} />
					</TextArrowLink>
				</div>
			</div>
			<EventListing events={data.events} />
		</section>
	{/if}

	<!-- blog post listing -->
	{#if data.posts.length}
		<section class="py-section max-w-pad desktop:space-y-15 tablet:space-y-10 space-y-8" id="posts">
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title">
						<T message={m['pages.people_slug.posts_by']} name={data.person.name} />
					</h2>
					<TextArrowLink class="ml-auto" href={routing.path('blog')}>
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
