<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';

	import { getLocalesContext } from '../locales-context/LocalesContext.svelte';

	import caretDown from './images/caret-down.svg?url';

	let {
		id,
		collapsed = $bindable(),
		...rest
	}: HTMLLabelAttributes & {
		id: string;
		/** @bindable */
		collapsed: boolean;
	} = $props();

	let locales = getLocalesContext();
</script>

<label {...rest}>
	<input class="codeblock-collapsed sr-only" type="checkbox" bind:checked={collapsed} {id} />
	<span class="sr-only">
		{collapsed ? locales.expand : locales.collapse}
	</span>
	<i style:--url={caretDown}></i>
</label>

<style lang="postcss">
	i {
		width: 1.25rem; /* 20px */
		height: 1.25rem; /* 20px */
	}

	label {
		transform: rotate(180deg);
		display: none;
		transition: transform 150ms ease-out;

		:global {
			/* show if codeblock is collapsible and not in fullscreen mode */
			.codeblock.collapsible:not(:has(.codeblock-fullscreen:checked)) & {
				display: block;
			}

			.codeblock:has(.codeblock-collapsed:checked) & {
				transform: rotate(0deg);
			}
		}
	}
</style>
