<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import type { ResolveTrigger } from '@svelte-put/modal';
	import { shortcut } from '@svelte-put/shortcut';
	import { createEventDispatcher } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import { getLangContext } from '$lib/contexts/lang';

	import { WireframeVersionNoticeCache } from './WireframeVersionNotice.cache';
	import { translations } from './translation';

	const { lang } = getLangContext();

	$: t = translations[$lang];

	const cache = new WireframeVersionNoticeCache();
	const shouldShow = cache.shouldShow;

	const dispatch = createEventDispatcher<{
		resolve: {
			trigger: ResolveTrigger;
		};
	}>();

	function escape() {
		cache.shouldShow = true;
		dispatch('resolve', { trigger: 'escape' });
	}

	function clickOutside() {
		cache.shouldShow = true;
		dispatch('resolve', { trigger: 'clickoutside' });
	}

	function takeIn() {
		cache.shouldShow = true;
		dispatch('resolve', { trigger: 'custom' });
	}

	function doNotShowAgain() {
		cache.shouldShow = false;
		dispatch('resolve', { trigger: 'custom' });
	}
</script>

<svelte:window use:shortcut={{ trigger: { key: 'Escape', callback: escape } }} />

<div class="absolute inset-0 grid h-full w-full place-items-center">
	<div
		aria-disabled
		class="absolute inset-0 -z-px backdrop-blur-sm"
		transition:fade={{ duration: 200 }}
	/>
	<div
		class="mx-6 space-y-4 rounded bg-bg-200 p-6 text-center shadow-lg md:p-10"
		use:clickoutside
		on:clickoutside={clickOutside}
		transition:fly={{ duration: 200, y: 50 }}
	>
		<p class="c-text-h3 font-bold uppercase">{t.title}</p>
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="40"
			height="40"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="mx-auto"
			><rect x="2" y="6" width="20" height="8" rx="1" /><path d="M17 14v7" /><path
				d="M7 14v7"
			/><path d="M17 3v3" /><path d="M7 3v3" /><path d="M10 14 2.3 6.3" /><path
				d="m14 6 7.7 7.7"
			/><path d="m8 6 8 8" /></svg
		>
		<p>
			{@html t.description}
		</p>
		<p>
			{@html t.feedbacks}
		</p>
		<div class="flex items-center justify-center space-x-4">
			<button on:click={takeIn} type="button" class="bg-bg-400 text-fg-400 c-btn">
				{t.ctas.continue}
			</button>
			{#if shouldShow === true}
				<button on:click={doNotShowAgain} type="button" class="border-bg-400 c-btn c-btn--outlined">
					{t.ctas.doNotShowAgain}
				</button>
			{/if}
		</div>
	</div>
</div>
