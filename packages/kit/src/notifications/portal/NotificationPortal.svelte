<script lang="ts">
	import { renderPopover } from '@svelte-put/async-stack/helpers';
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	import type { NotificationPortalProps } from '.';

	let { stack, ...rest }: NotificationPortalProps = $props();

	// track the height to position the next notification properly
	let elementMap: Record<string, HTMLDivElement> = $state({});
	let elementAccumulatedHeightMap = $derived.by(() => {
		let elementAccumulatedHeightMap: Record<string, number> = {};
		let currentHeight = 0;
		for (const [id, li] of Object.entries(elementMap)) {
			elementAccumulatedHeightMap[id] = currentHeight;
			currentHeight += li.offsetHeight + 8;
		}
		return elementAccumulatedHeightMap;
	});
</script>

<aside id="notifications" {...rest}>
	{#each stack.items as item, i (item.config.id)}
		{@const id = item.config.id}
		<div
			{...renderPopover(item)}
			role="alert"
			aria-live="polite"
			aria-atomic="true"
			in:fly={{ x: 150, duration: 200 }}
			out:fly={{ x: 100, duration: 150 }}
			animate:flip={{ duration: 200 }}
			{@attach (el) => {
				elementMap[item.config.id] = el as HTMLDivElement;
				return () => delete elementMap[item.config.id];
			}}
			style:--element-index={i}
			style:--accumulated-height={elementAccumulatedHeightMap[id] + 'px'}
		></div>
	{/each}
</aside>

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

	div {
		position: fixed;
		top: calc(1rem + var(--accumulated-height) + var(--element-index) * 0.5rem);
		right: 1rem;
		left: 1rem;

		margin: 0;
		padding: 0;
		border: 0;

		background-color: transparent;

		@media (--tablet) {
			left: auto;
			max-width: 80%;
		}

		@media (--desktop) {
			max-width: 50%;
		}
	}
</style>
