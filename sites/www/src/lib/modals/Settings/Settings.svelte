<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';
	import type { ResolveTrigger } from '@svelte-put/modal';
	import { shortcut } from '@svelte-put/shortcut';
	import { createEventDispatcher, onMount } from 'svelte';
	import { fade, fly } from 'svelte/transition';

	import type { DirtyFormStore } from '$lib/actions/dirtyform';
	import { Settings, translations } from '$lib/components/Settings';
	import { getLangContext } from '$lib/contexts/lang';
	import { getLockScrollContext } from '$lib/contexts/lockscroll';
	import { modalStore } from '$lib/modals';
	import { Confirmation } from '$lib/modals/Confirmation';

	let dirty: DirtyFormStore;

	const { lang } = getLangContext();

	$: t = translations[$lang];

	const dispatch = createEventDispatcher<{
		resolve: {
			trigger: ResolveTrigger;
		};
	}>();

	async function confirm() {
		if (!$dirty) return true;
		const pushed = modalStore.push({
			component: Confirmation,
			props: {
				title: t.unsavedChanges.title,
				description: t.unsavedChanges.description,
			},
		});
		const { confirmed } = await pushed.resolve();
		return confirmed;
	}

	async function escape() {
		if (await confirm()) {
			dispatch('resolve', { trigger: 'escape' });
		}
	}

	async function clickOutside() {
		if (await confirm()) {
			dispatch('resolve', { trigger: 'clickoutside' });
		}
	}

	async function dismiss() {
		if (await confirm()) {
			dispatch('resolve', { trigger: 'x' });
		}
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
	<div aria-disabled class="c-backdrop" transition:fade={{ duration: 200 }} />
	<div
		class="burder-outline relative max-h-[96dvh] max-w-[min(1200px,100dvw)] overflow-auto bg-bg"
		use:clickoutside={{ limit: { parent: container } }}
		on:clickoutside={clickOutside}
		transition:fly={{ duration: 200, y: 50 }}
	>
		<div
			class="sticky top-0 z-10 border-b border-current bg-bg px-6 pb-4 pt-6 tb:px-10 tb:pb-6 tb:pt-8"
		>
			<p class="c-text-h2 -mt-2 font-bold">Settings</p>
			<button on:click={dismiss} class="absolute right-6 top-6 hover:text-primary active:scale-95">
				<svg inline-src="lucide/x" width="24" height="24" />
			</button>
		</div>
		<Settings variant="modal" bind:dirty />
	</div>
</div>
