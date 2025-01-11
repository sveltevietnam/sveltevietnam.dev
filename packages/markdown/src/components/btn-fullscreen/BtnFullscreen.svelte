<script lang="ts">
	import { onMount } from 'svelte';
	import { HTMLLabelAttributes } from 'svelte/elements';

	import { getGroupContext } from '../code-block-group/CodeBlockGroup.svelte';
	import { getLocalesContext } from '../locales-context/LocalesContext.svelte';

	import cornersIn from './images/corners-in.svg?url';
	import cornersOut from './images/corners-out.svg?url';

	let {
		id,
		codeblock,
		...rest
	}: HTMLLabelAttributes & {
		id: string;
		codeblock?: HTMLElement;
	} = $props();

	let fullscreen = $state(false);
	const group = getGroupContext();
	const locales = getLocalesContext();

	function onFullScreenChange() {
		fullscreen = !!document.fullscreenElement;
	}

	function goFullscreen() {
		if (!document.fullscreenElement) {
			if (group?.node) {
				group.node.requestFullscreen();
			} else {
				codeblock?.requestFullscreen();
			}
		} else if (document.exitFullscreen) {
			document.exitFullscreen();
		}
	}

	function onKeyDown(e: KeyboardEvent) {
		if (e.key === 'Enter' || e.key === ' ') {
			e.preventDefault();
			goFullscreen();
		}
	}

	function onClick(e: MouseEvent) {
		e.preventDefault();
		goFullscreen();
	}

	onMount(() => {
		document.addEventListener('fullscreenchange', onFullScreenChange);
		return () => {
			document.removeEventListener('fullscreenchange', onFullScreenChange);
		};
	});
</script>

<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
<label for={id} {...rest} onclick={onClick} onkeydown={onKeyDown}>
	<span class="sr-only">{fullscreen ? locales.minimize : locales.maximize}</span>
	{#if !group}
		<input class="codeblock-fullscreen sr-only" type="checkbox" {id} bind:checked={fullscreen} />
	{/if}
	<i class="maximize" style:--url={cornersOut}></i>
	<i class="minimize" style:--url={cornersIn}></i>
</label>

<style lang="postcss">
	/** copied from CodeBlock */
	@custom-selector :--fullscreen :has(.codeblock-fullscreen:checked);
	@custom-selector :--g-fullscreen
		:global(.codeblock-group:has(.codeblock-group-fullscreen:checked));
	@custom-selector :--g-fullscreen-focus
		:global(.codeblock-group:has(.codeblock-group-fullscreen:focus-visible));

	.minimize {
		display: none;
	}

	:--g-fullscreen-focus label {
		outline: 2px solid var(--color-outline-focus);
		outline-offset: -2px;
	}

	:--g-fullscreen,
	label:has(:global(.codeblock-fullscreen:checked)) {
		& .maximize {
			display: none;
		}

		& .minimize {
			display: block;
		}
	}
</style>
