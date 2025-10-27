<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import { TBA } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import { page } from '$app/state';
	import type { EventMetadata } from '$data/events';
	import * as p from '$data/routes/generated';
	import EventListing from '$lib/components/event-listing/EventListing.svelte';

	const { routing } = Contexts.get();

	let {
		events,
	}: {
		events: EventMetadata[];
	} = $props();
</script>

<section
	class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10"
	data-pagefind-ignore
>
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg" id="events"><T key="pages.home.events.heading" /></h2>
		<p class="max-w-readable mx-auto"><T key="pages.home.events.desc" /></p>
	</div>
	{#if events.length}
		<EventListing {events} origin={page.url.origin} />
	{:else}
		<TBA class="mx-auto w-fit text-center">
			<p class="c-text-title-sm"><T key="pages.home.events.tba.desc" /></p>
			<p>
				<a class="c-link" href="{p['/:lang/events']({ lang: routing.lang })}#participate">
					<T key="pages.home.events.tba.subscribe" />
				</a>
				<br />
				<T key="or" />
				<br />
				<a class="c-link" href="{p['/:lang/events']({ lang: routing.lang })}#past">
					<T key="pages.home.events.tba.view_past" />
				</a>
			</p>
		</TBA>
	{/if}
</section>
