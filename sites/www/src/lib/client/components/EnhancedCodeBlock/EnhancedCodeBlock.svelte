<script lang="ts">
	import { copy } from '@svelte-put/copy';
	import { fly } from 'svelte/transition';

	let trigger: HTMLButtonElement;

	let copied = false;
	function onCopied() {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1200);
	}
</script>

<div class="relative">
	<button
		bind:this={trigger}
		class="absolute right-4 top-4 opacity-50 transition-opacity hover:opacity-100 disabled:cursor-pointer"
		disabled={copied}
	>
		<span class="sr-only">Copy</span>
		{#if copied}
			<svg inline-src="lucide/copy-check" width="20" height="20" in:fly={{ y: 10 }} />
		{:else}
			<svg inline-src="lucide/copy" width="20" height="20" in:fly={{ y: 10 }} />
		{/if}
	</button>
	<div use:copy={{ trigger }} on:copied={onCopied}>
		<slot>
			<!-- <pre><code>...</code></pre> -->
		</slot>
	</div>
</div>
