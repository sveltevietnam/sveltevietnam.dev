<script lang="ts">
	import { copy, type TextResolverInput } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	let trigger: HTMLButtonElement;

	function copyText(input: TextResolverInput<'click'>) {
		const codeNode = input.node.getElementsByTagName('code')[0];
		if (!codeNode) return '';
		let text = '';
		for (const lineNode of codeNode.children) {
			// assuming shiki build output and transformers set up at mdsvex.config.js
			if ((lineNode as HTMLElement).dataset.lineDiff === '-') continue;
			text += (lineNode.textContent || '') + '\n';
		}

		return text;
	}

	let copied = false;
	function onCopied() {
		copied = true;
		setTimeout(() => {
			copied = false;
		}, 1800);
	}

	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});
</script>

<div class="relative">
	{#if hydrated}
		<button
			bind:this={trigger}
			class="absolute right-4 top-4 opacity-50 transition-opacity hover:opacity-100 disabled:cursor-pointer"
			disabled={copied}
		>
			<span class="sr-only">Copy</span>
			{#if copied}
				<svg
					class="stroke-white"
					inline-src="lucide/copy-check"
					width="20"
					height="20"
					in:fly={{ y: 10 }}
				/>
			{:else}
				<svg
					class="stroke-white"
					inline-src="lucide/copy"
					width="20"
					height="20"
					in:fly={{ y: 10 }}
				/>
			{/if}
		</button>
	{/if}
	<div use:copy={{ trigger, text: copyText }} on:copied={onCopied}>
		<slot>
			<!-- <pre><code>...</code></pre> -->
		</slot>
	</div>
</div>
