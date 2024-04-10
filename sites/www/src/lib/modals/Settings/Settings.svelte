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
		class="absolute inset-0 -z-px backdrop-blur-lg"
		transition:fade={{ duration: 200 }}
	/>
	<div
		class="burder-outline relative max-h-[96dvh] max-w-[min(1200px,100dvw)] overflow-auto rounded border bg-bg"
		use:clickoutside={{ limit: { parent: container } }}
		on:clickoutside={clickOutside}
		transition:fly={{ duration: 200, y: 50 }}
	>
		<div class="sticky top-0 z-10 border-b border-current bg-bg px-6 py-6 tb:px-10 tb:py-8">
			<p class="c-text-h2 -mt-2 font-bold">Settings</p>
			<button on:click={dismiss} class="absolute right-6 top-6 hover:text-primary active:scale-95">
				<svg inline-src="lucide/x" width="24" height="24" />
			</button>
		</div>
		<Settings variant="modal" />
	</div>
</div>
