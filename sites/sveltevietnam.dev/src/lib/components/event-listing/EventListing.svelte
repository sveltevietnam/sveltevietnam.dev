<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import EventListingItem, { type EventListingItemProps } from './EventListingItem.svelte';

	let {
		events,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLUListElement> & { events: EventListingItemProps['event'][] } = $props();
</script>

<ul class={['tablet:space-y-10 divide-outline space-y-6 divide-y divide-dashed', cls]} {...rest}>
	{#each events as event (event.slug)}
		<li class="tablet:pb-10 pb-6">
			<EventListingItem {event} />
		</li>
	{/each}
</ul>
