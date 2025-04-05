<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { Avatar } from '$lib/components/avatar';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { PersonLinks } from '$lib/components/person-links';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import { RoutingContext } from '$lib/routing/context.svelte';

	let { data } = $props();

	const routing = RoutingContext.get();
</script>

<main>
	<!-- intro -->
	<section
		class="space-y-section pt-intro-pad-top from-32% from-primary-surface to-surface
		bg-gradient-to-b"
	>
		<div class="max-w-pad space-y-10">
			<Breadcrumbs crumbs={data.routing.breadcrumbs} />
			<div class="space-y-4">
				<h1 class="c-text-heading-lg text-primary-on-surface font-bold">
					<T message={m['pages.people.heading']}></T>
				</h1>
				<p class="c-text-subtitle-page max-w-[70ch]"><T message={m['pages.people.desc']}></T></p>
			</div>
		</div>
		<IntroSeparator />
	</section>

	<!-- listing -->
	<section class="max-w-pad py-section-more">
		<ul class="divide-outline divide-y">
			{#each data.people as { id, name, description, links, avatar } (id)}
				{@const href = routing.path('people/:id', id)}
				<li
					class="tablet:items-center tablet:gap-10 max-w-200 not-last:mb-10 not-last:pb-10 flex items-start gap-6"
				>
					<a {href}>
						<span class="tablet:hidden sr-only">
							<T message={m.view_more} />
						</span>
						<Avatar class="w-30 h-30" src={avatar} {name} />
					</a>
					<div class="flex-1 space-y-2">
						<p class="c-text-title font-bold">{name}</p>
						<p>{description}</p>
						<PersonLinks {links} />
					</div>
					<TextArrowLink class="mobile:hidden self-end" {href}>
						<T message={m.view_more} />
					</TextArrowLink>
				</li>
			{/each}
		</ul>
	</section>
</main>
