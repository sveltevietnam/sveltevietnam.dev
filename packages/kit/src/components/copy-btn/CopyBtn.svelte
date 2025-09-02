<script lang="ts">
	import { copy } from '@svelte-put/copy';
	import { T } from '@sveltevietnam/i18n';
	import { fly } from 'svelte/transition';

	import { type CopyBtnProps } from '.';

	let {
		textToCopy,
		aria,
		iconClass = 'i-[ph--link]',
		...rest
	}: CopyBtnProps = $props();

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
	type="button"
	use:copy={{ text: textToCopy }}
	oncopied={onCopied}
	onmouseleave={onMouseLeaveCopyButton}
	onmouseenter={onMouseEnterCopyButton}
	{...rest}
>
	<span class="sr-only">
		<T message={aria} />
	</span>
	{#if copied}
		<i class="i i-[ph--clipboard-text] h-6 w-6" in:fly={{ duration: 200, y: 10 }}></i>
	{:else}
		<i class={['i h-6 w-6', iconClass]} in:fly={{ duration: 200, y: 10 }}></i>
	{/if}
</button>
