<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import { page } from '$app/state';
	import * as p from '$data/routes/generated';
	import { BlogPostCommonList } from '$lib/components/blog-post-common-list';
	import { EventListing } from '$lib/components/event-listing';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { Pagination } from '$lib/components/pagination';
	import { PersonLinks } from '$lib/components/person-links';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();

	let paginationUrl = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity
		const url = new URL(page.url);
		url.hash = 'posts';
		return url;
	});

	const links = $derived({
		events: p['/:lang/events']({ lang: routing.lang }),
		blog: p['/:lang/blog']({ lang: routing.lang }),
	});
</script>

<main {...pagefind.page({ group: 'people', importance: 'detail' })}>
	<!-- intro -->
	<section class="group overflow-hidden">
		<div class="max-w-pad tablet:gap-10 tablet:flex-row flex flex-col">
			<div
				class={[
					'tablet:space-y-8 pt-intro-pad-top relative z-1 flex-1 space-y-6',
					!data.person.popImage && 'pb-section',
				]}
			>
				<Breadcrumbs crumbs={data.routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-lg text-primary-on-surface font-bold">
						{data.person.name}
					</h1>
					<p class="c-text-subtitle-page max-w-readable">{data.person.description}</p>
					<PersonLinks links={data.person.links} />
				</div>
			</div>
			{#if data.person.popImage}
				<div
					class="tablet:pt-intro-pad-top tablet:px-6 desktop:px-10 can-hover:grayscale self-end
					transition-[filter] duration-400 group-hover:filter-none group-hover:duration-100"
				>
					<enhanced:img
						class="tablet:w-70 desktop:w-80 can-hover:translate-y-6 can-hover:scale-90
						relative h-auto w-60 transition-transform duration-400
						group-hover:translate-y-0 group-hover:scale-100 group-hover:duration-75"
						src={data.person.popImage}
						alt=""
					/>
				</div>
			{/if}
		</div>
		<IntroSeparator variant="full" class="relative z-2" />
	</section>

	<!-- contribute to these events -->
	{#if data.events.length}
		<section
			class="py-section max-w-pad desktop:space-y-15 tablet:space-y-10 space-y-8"
			data-pagefind-ignore
		>
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title" id="events">
						<T key="pages.people_id.events" params={{ name: data.person.name }} />
					</h2>
					<TextArrowLink class="ml-auto" href={links.events}>
						<T key="pages.people_id.view_events" />
					</TextArrowLink>
				</div>
			</div>
			<EventListing events={data.events} origin={page.url.origin} />
		</section>
	{/if}

	<!-- appear as author to these posts -->
	{#if data.posts.length}
		<section
			class="py-section max-w-pad desktop:space-y-15 tablet:space-y-10 space-y-8"
			data-pagefind-ignore
		>
			<div class="space-y-4 border-t-4 border-current pt-2">
				<div class="flex flex-wrap items-baseline justify-between gap-4">
					<h2 class="c-text-title" id="posts">
						<T key="pages.people_id.posts_by" params={{ name: data.person.name }} />
					</h2>
					<TextArrowLink class="ml-auto" href={links.blog}>
						<T key="pages.people_id.view_blog" />
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
