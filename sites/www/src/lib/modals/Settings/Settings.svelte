<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import type { ResolveTrigger } from '@svelte-put/modal';
	import { shortcut } from '@svelte-put/shortcut';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { Settings } from '$lib/components/Settings';
	import { getLockScrollContext } from '$lib/contexts/lockscroll';

	const dispatch = createEventDispatcher<{
		resolve: {
			trigger: ResolveTrigger;
		};
	}>();

	function escape() {
		dispatch('resolve', { trigger: 'escape' });
	}

	function clickOutside() {
		dispatch('resolve', { trigger: 'clickoutside' });
	}

	function dismiss() {
		dispatch('resolve', { trigger: 'x' });
	}

	let container: HTMLElement;
	const lockScrollStore = getLockScrollContext();
	onMount(() => {
		if (lockScrollStore) $lockScrollStore = true;

		return () => {
			if (lockScrollStore) $lockScrollStore = false;
		};
	});
</script>

<svelte:window use:shortcut={{ trigger: { key: 'Escape', callback: escape } }} />

<div
	class="absolute inset-0 grid h-full w-full max-w-full place-items-center"
	bind:this={container}
>
	<div
		aria-disabled
		class="absolute inset-0 -z-px backdrop-blur"
		transition:fade={{ duration: 200 }}
	/>
	<div
		class="relative max-h-[80dvh] max-w-[min(1200px,90vw)] overflow-auto border-2 bg-bg p-10 shadow-lg"
		use:clickoutside={{ limit: { parent: container } }}
		on:clickoutside={clickOutside}
		transition:fly={{ duration: 200, y: 50 }}
	>
		<div class="sticky top-0 z-10 flex justify-end">
			<button
				on:click={dismiss}
				class="rounded-full border bg-bg p-2 transition-colors hover:bg-fg hover:text-bg"
			>
				<svg inline-src="lucide/x" width="24" height="24" />
			</button>
		</div>
		<p class="c-text-h1 -mt-2 font-bold">Settings</p>
		<div class="my-10 h-px w-full bg-current" />
		<Settings />
	</div>
</div>
