<script lang="ts" module>
	import type { TextResolverInput } from '@svelte-put/copy';

	/**
	 * copy code exclude meta lines. Pass as `text` arg to `@svelte-put/copy`
	 */
	export function copyCode(input: TextResolverInput<'click'>): string {
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
</script>

<script lang="ts">
	import type { HTMLButtonAttributes } from 'svelte/elements';
	import { fade } from 'svelte/transition';

	import { getLocalesContext } from '../locales-context/LocalesContext.svelte';

	let {
		trigger = $bindable(),
		...rest
	}: HTMLButtonAttributes & {
		/** @bindable */
		trigger?: HTMLButtonElement;
	} = $props();

	let timeoutId: ReturnType<typeof setTimeout> | undefined = undefined;
	let copied = $state(false);

	const locales = getLocalesContext();

	function onClick() {
		copied = true;
	}
	function onMouseEnter() {
		clearTimeout(timeoutId);
	}
	function onMouseLeave() {
		timeoutId = setTimeout(() => {
			copied = false;
		}, 1800);
	}
</script>

<button
	type="button"
	bind:this={trigger}
	disabled={copied}
	onmouseleave={onMouseLeave}
	onmouseenter={onMouseEnter}
	onclick={onClick}
	{...rest}
>
	<span class="sr-only">{locales.copy}</span>
	{#key copied}
		<i
			class={['i', copied ? 'i-[ph--clipboard-text]' : 'i-[ph--clipboard]']}
			in:fade={{ duration: 150 }}
		></i>
	{/key}
</button>

<style>
	button {
		&:disabled {
			/* allow clicking even if already copied */
			cursor: pointer;
		}
	}
</style>
