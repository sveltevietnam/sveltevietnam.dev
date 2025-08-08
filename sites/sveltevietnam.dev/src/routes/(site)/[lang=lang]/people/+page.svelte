<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import type { Person } from '$data/people';
	import * as p from '$data/routes/generated';
	import fallback1x1 from '$lib/assets/images/fallbacks/1x1.jpg?enhanced&w=w=640;320&imagetools';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { PersonLinks } from '$lib/components/person-links';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import * as pagefind from '$lib/pagefind/attributes';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();
</script>

{#snippet PersonListItem(person: Person)}
	{@const href = p['/:lang/people/:id']({
		lang: settings.language,
		id: person.id,
	})}
	{@const image = person.popImage || person.avatar || fallback1x1}
	<div class="@container w-full">
		<article
			class="shadow-brutal hover:shadow-brutal-lg bg-surface @2xl:flex-row @2xl:gap-10 group/person
			@2xl:items-center duration-400 relative flex flex-col gap-6 border-2
			border-current transition-shadow hover:duration-75"
		>
			{#if image}
				<a
					class={[
						person.popImage &&
							'bg-tertiary-surface dark:bg-secondary-surface can-hover:opacity-80 duration-400 flex items-end justify-center self-stretch overflow-hidden px-6 pt-4 transition-opacity group-hover/person:opacity-100 group-hover/person:duration-75',
						!person.popImage && 'self-stretch',
					]}
					{href}
				>
					<span class="sr-only">
						<T message={m.view_more} />
					</span>
					<div
						class={[
							person.popImage &&
								'can-hover:translate-y-2 can-hover:scale-95 duration-400 relative transition-transform group-hover/person:translate-y-0 group-hover/person:scale-100 group-hover/person:duration-75',
						]}
					>
						<enhanced:img
							class={[
								'can-hover:grayscale duration-400 transition-[filter] group-hover/person:filter-none group-hover/person:duration-100',
								person.popImage && 'h-45 w-45 object-top',
								!person.popImage && 'h-52 w-52',
							]}
							src={image}
							alt=""
						/>
					</div>
				</a>
			{/if}
			<div
				class={[
					'@2xl:space-y-4 flex-1 space-y-3',
					!person.popImage ? 'p-6' : '@max-2xl:px-6 @xl:py-6',
				]}
			>
				<a {href} class="c-link-preserved block w-fit"><p class="c-text-title">{person.name}</p></a>
				<p>{person.description}</p>
				<PersonLinks links={person.links} />
			</div>
			<TextArrowLink
				class="text-surface bg-on-surface translate-px hover:bg-primary-on-surface @2xl:absolute @2xl:bottom-0 @2xl:right-0 relative self-end px-4 py-2 transition-colors"
				{href}
			>
				<T message={m.view_more} />
			</TextArrowLink>
		</article>
	</div>
{/snippet}

<main {...pagefind.page({ group: 'people', importance: 'listing' })}>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div class="max-w-pad space-y-10">
			<Breadcrumbs crumbs={routing.breadcrumbs} />
			<div class="space-y-4">
				<h1 class="c-text-heading-lg text-primary-on-surface font-bold">
					<T message={m['pages.people.heading']}></T>
				</h1>
				<p class="c-text-subtitle-page max-w-readable leading-relaxed">
					<T message={m['pages.people.desc']}></T>
				</p>
			</div>
		</div>
		<IntroSeparator />
	</section>

	<!-- listing -->
	<section class="max-w-pad py-section-more">
		<h2 class="sr-only" id="listing">
			<T message={m.listing} />
		</h2>
		<ul class="divide-outline max-w-200 divide-y">
			{#each data.people as person (person.id)}
				<li
					class="tablet:items-center tablet:gap-10 not-last:mb-10 not-last:pb-10 flex items-start gap-6"
				>
					{@render PersonListItem(person)}
				</li>
			{/each}
		</ul>
	</section>
</main>
