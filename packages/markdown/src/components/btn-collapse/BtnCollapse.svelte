<script lang="ts">
	import type { HTMLLabelAttributes } from 'svelte/elements';

	import { getLocalesContext } from '../locales-context/LocalesContext.svelte';

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
	<i class="i i-[caret-down]"></i>
</label>

<style lang="postcss">
	label {
		transform: rotate(-180deg);
		display: none;
		transition: transform 150ms ease-out;

		:global {
			/* show if codeblock is collapsible and not in fullscreen mode */
			.codeblock.collapsible:not(:has(.codeblock-fullscreen:checked)) & {
				display: flex;
			}

			.codeblock:has(.codeblock-collapsed:checked) & {
				transform: rotate(0deg);
			}
		}
	}
</style>
