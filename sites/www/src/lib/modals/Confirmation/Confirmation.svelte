<script context="module" lang="ts">
	const translations = {
		en: {
			confirm: 'Confirm',
			cancel: 'Cancel',
		},
		vi: {
			confirm: 'Xác nhận',
			cancel: 'Từ chối',
		},
	};
</script>

<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import type { ResolveTrigger } from '@svelte-put/modal';
	import { shortcut } from '@svelte-put/shortcut';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { getLangContext } from '$lib/contexts/lang';
	import { getLockScrollContext } from '$lib/contexts/lockscroll';

	export let title: string;
	export let description: string;

	const { lang } = getLangContext();

	$: t = translations[$lang];

	const dispatch = createEventDispatcher<{
		resolve: {
			trigger: ResolveTrigger;
			confirmed: boolean;
		};
	}>();

	function escape() {
		dispatch('resolve', { trigger: 'escape', confirmed: false });
	}

	function clickOutside() {
		dispatch('resolve', { trigger: 'clickoutside', confirmed: false });
	}

	function dismiss() {
		dispatch('resolve', { trigger: 'x', confirmed: false });
	}

	function confirm() {
		dispatch('resolve', { trigger: 'custom', confirmed: true });
	}

	function cancel() {
		dispatch('resolve', { trigger: 'custom', confirmed: false });
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
		class="relative max-h-[80dvh] max-w-[min(1200px,90vw)] overflow-auto border bg-bg p-6 shadow-lg tb:p-8"
		use:clickoutside={{ limit: { parent: container } }}
		on:clickoutside={clickOutside}
		transition:fly={{ duration: 200, y: 50 }}
	>
		<button class="absolute right-6 top-6" on:click={dismiss}>
			<svg inline-src="lucide/x" width="24" height="24" />
		</button>
		<div class="space-y-6 tb:space-y-8">
			<p class="c-text-h3 font-bold after:mt-2 after:separator">{title}</p>
			<p>{description}</p>
			<div class="flex items-center justify-end gap-6">
				<button class="c-btn c-btn--outlined" type="button" on:click={cancel}>{t.cancel}</button>
				<button class="c-btn" type="button" on:click={confirm}>{t.confirm}</button>
			</div>
		</div>
	</div>
</div>
