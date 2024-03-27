<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import type { ResolveTrigger } from '@svelte-put/modal';
	import { shortcut } from '@svelte-put/shortcut';
	import QrScanner from 'qr-scanner';
	import { createEventDispatcher, onDestroy, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { getLockScrollContext } from '$lib/contexts/lockscroll';

	const DEFAULT_TEXTS = {
		title: 'Scan QR Code',
		description: 'Additional permissions might be required to access your camera.',
	};

	export let texts = DEFAULT_TEXTS;

	const dispatch = createEventDispatcher<{
		resolve: {
			trigger: ResolveTrigger;
			data?: string;
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
	let videoEl: HTMLVideoElement;
	onMount(async () => {
		if (lockScrollStore) $lockScrollStore = true;

		const qrScanner = new QrScanner(
			videoEl,
			(result) => {
				const { data } = result;
				qrScanner.stop();
				dispatch('resolve', { trigger: 'custom', data });
			},
			{
				highlightScanRegion: true,
				highlightCodeOutline: true,
			},
		);
		qrScanner.start();
	});

	onDestroy(() => {
		if (lockScrollStore) $lockScrollStore = false;
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
		class="relative border bg-bg p-10 shadow-lg"
		use:clickoutside={{ limit: { parent: container } }}
		on:clickoutside={clickOutside}
		transition:fly={{ duration: 200, y: 50 }}
	>
		<button class="absolute right-6 top-6" on:click={dismiss}>
			<svg inline-src="lucide/x" width="24" height="24" />
		</button>
		<div class="space-y-6">
			<p class="c-text-h2 font-medium after:mt-2 after:separator">{texts.title}</p>
			<p class="">{texts.description}</p>
			<!-- svelte-ignore a11y-media-has-caption -->
			<video bind:this={videoEl}></video>
		</div>
	</div>
</div>
