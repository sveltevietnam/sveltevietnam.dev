<script lang="ts">
	import { copy } from '@svelte-put/copy';
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fly } from 'svelte/transition';

	let {
		text,
		aria,
		iconClass = 'i-[ph--link]',
		class: cls,
		...rest
	}: HTMLButtonAttributes & {
		text: string;
		aria: string;
		iconClass?: string;
	} = $props();

	let copyTimeoutId: ReturnType<typeof setTimeout>;
	let copied = $state(false);
	function onCopied() {
		copied = true;
	}
	function onMouseEnterCopyButton() {
		clearTimeout(copyTimeoutId);
	}
	function onMouseLeaveCopyButton() {
		copyTimeoutId = setTimeout(() => {
			copied = false;
		}, 1000);
	}
</script>

<!-- TODO: Add tooltip on hover? -->
<button
	class={['c-link-icon flex rounded-full border-onehalf border-current p-2', cls]}
	use:copy={{ text }}
	oncopied={onCopied}
	onmouseleave={onMouseLeaveCopyButton}
	onmouseenter={onMouseEnterCopyButton}
	{...rest}
>
	<span class="sr-only">{aria}</span>
	{#if copied}
		<i class="i i-[ph--clipboard-text] h-6 w-6" in:fly={{ duration: 200, y: 10 }}></i>
	{:else}
		<i class={['i h-6 w-6', iconClass]} in:fly={{ duration: 200, y: 10 }}></i>
	{/if}
</button>
