<script lang="ts" module>
	import { onMount, setContext, getContext } from 'svelte';

	import type { CodeBlockGroupProps, CodeBlockGroupContext } from './CodeBlockGroup.svelte.d.ts';

	export const CONTEXT_KEY = 'enhanced:codeblock:group';

	export const getGroupContext = () => {
		return getContext<CodeBlockGroupContext>(CONTEXT_KEY);
	};
</script>

<script lang="ts">
	let {
		cols,
		name,
		display = 'files',
		title = $bindable(),
		children,
		class: cls,
		...rest
	}: CodeBlockGroupProps = $props();

	let groupEl: HTMLDivElement;

	const context = setContext<CodeBlockGroupContext>(CONTEXT_KEY, {
		id: Math.random().toString(36).slice(2).toString(),
		name,
		display,
		get title(): string | undefined {
			return title;
		},
		set title(t: string) {
			title = t;
		},
	});

	let fullscreen = $state(false);
	function onFullScreenChange() {
		fullscreen = !!document.fullscreenElement;
	}

	onMount(() => {
		context.node = groupEl;
	});
</script>

<div
	class="codeblock-group codeblock-group--{display} {cls}"
	style:--cols={cols}
	{...rest}
	bind:this={groupEl}
	onfullscreenchange={onFullScreenChange}
>
	{#if children}
		{@render children()}
	{/if}
	<input
		id="codeblock-group-{context.id}-fullscreen"
		class="codeblock-group-fullscreen sr-only"
		type="checkbox"
		bind:checked={fullscreen}
	/>
	<div class="first-row-last-col-fill"></div>
</div>

<style lang="postcss">
	.first-row-last-col-fill {
		position: relative;

		grid-column: -2;

		border-color: var(--color-outline);
		border-style: solid;
		border-top-right-radius: 4px;

		background-color: var(--color-bg);
	}

	.codeblock-group {
		position: relative;

		overflow: auto;
		display: grid;
		grid-template-columns: repeat(var(--cols), auto) 1fr;
		grid-template-rows: auto 1fr;

		max-width: 100%;
		margin-block: 1.5rem; /** 24px */

		&:where(:global(.codeblock-group--files)) .first-row-last-col-fill {
			border-width: 1px 1px 0 0;
		}
	}
</style>
