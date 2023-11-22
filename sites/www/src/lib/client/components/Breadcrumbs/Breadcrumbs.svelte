<script lang="ts">
	import { onMount } from 'svelte';

	import type { Breadcrumb } from '$shared/services/navigation';

	export let breadcrumbs: Breadcrumb[];
	let cls = '';
	export { cls as class };

	let scrollableLeft = true;
	let scrollableRight = true;
	let scrollable = false;

	let ol: HTMLOListElement;
	const PAD = 10;
	function checkScrollable() {
		scrollable = ol.scrollWidth > ol.offsetWidth;
		scrollableLeft = ol.scrollLeft > PAD;
		scrollableRight = ol.scrollLeft + ol.offsetWidth < ol.scrollWidth - PAD;
	}

	onMount(checkScrollable);
</script>

<svelte:window on:resize={checkScrollable} />

<nav
	aria-label="breadcrumb"
	class="tp-body2 {cls}"
	data-scrollable={scrollable}
	data-scrollable-left={scrollableLeft}
	data-scrollable-right={scrollableRight}
>
	<ol
		class="flex items-center gap-3 overflow-auto scrollbar-hidden"
		bind:this={ol}
		on:scroll={checkScrollable}
	>
		{#each breadcrumbs as { label, href }, i}
			{@const last = i === breadcrumbs.length - 1}
			<li {...last && { 'aria-current': 'page' }} class="contents">
				{#if href}
					<a {href} class="c-link c-link--mixed shrink-0">{label}</a>
				{:else}
					<span class="whitespace-nowrap text-fg-200">{label}</span>
				{/if}
				{#if !last}
					<svg inline-src="icon/caret" width="14" height="14" class="shrink-0" />
				{/if}
			</li>
		{/each}
	</ol>
</nav>

<style lang="postcss">
	nav {
		margin-right: calc(-1 * var(--container-padding-x));
		margin-left: calc(-1 * var(--container-padding-x));
	}

	ol {
		padding-right: var(--container-padding-x);
		padding-left: var(--container-padding-x);
	}

	nav[data-scrollable]:not([data-scrollable='false']) {
		--blur-background-from: theme('colors.bg.DEFAULT');
		--blur-background-to: rgb(0 0 0 / 0%);

		position: relative;

		&::before,
		&::after {
			pointer-events: none;
			content: '';

			position: absolute;
			z-index: 2;
			top: 0;
			bottom: 0;

			display: block;

			width: 100px;

			opacity: 0;

			transition: opacity 250ms ease;
		}

		&::before {
			left: 0;
			background: linear-gradient(
				270deg,
				var(--blur-background-to) 0%,
				var(--blur-background-from) 100%
			);
		}

		&::after {
			right: 0;
			background: linear-gradient(
				270deg,
				var(--blur-background-from) 0%,
				var(--blur-background-to) 100%
			);
		}

		&[data-scrollable-left='true']::before {
			opacity: 1;
		}

		&[data-scrollable-right='true']::after {
			opacity: 1;
		}
	}
</style>
