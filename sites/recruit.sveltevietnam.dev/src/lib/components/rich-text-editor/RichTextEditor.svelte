<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n/runtime';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';
	import { on } from 'svelte/events';

	import { Editor, type EditorInit } from './editor';
	import Toolbar from './editor/components/Toolbar.svelte';

	export interface RichTextEditorProps
		extends EditorInit,
			Omit<HTMLAttributes<HTMLElement>, 'onchange' | 'placeholder'> {
		placeholder?: Message<'string', never>;
		onchange?: (html: string) => void;
		maxLength?: number;
	}
</script>

<script lang="ts">
	let {
		onchange,
		cache,
		headings = [1, 6],
		html,
		placeholder,
		maxLength,
		class: cls,
		'aria-labelledby': ariaLabelledby,
		id,
		...rest
	}: RichTextEditorProps = $props();

	const { routing } = Contexts.get();
	let element: HTMLElement;
	let editor = new Editor({ html, headings, cache, maxLength });

	onMount(() => {
		return on(element, 'changehtml', (event) => {
			onchange?.((event as CustomEvent<{ html: string }>).detail.html);
		});
	});
</script>

<div
	class={[
		'border-onehalf bg-surface relative flex flex-col-reverse border-current',
		'focus-within:outline-outline-focus focus-within:border-outline-focus focus-within:outline focus-within:outline-offset-1',
		cls,
	]}
	{...rest}
>
	<Toolbar {editor} />

	<div class="z-1 relative">
		<!-- composer -->
		<div
			role="textbox"
			tabindex="0"
			{...ariaLabelledby ? { 'aria-labelledby': ariaLabelledby } : {}}
			{...id ? { id } : {}}
			class="prose h-160 max-w-full resize-y overflow-auto px-4 py-3 outline-none"
			contenteditable
			bind:this={element}
			{...editor.attach(() => routing.lang)}
		></div>

		<!-- placeholder -->
		{#if placeholder && editor.canShowPlaceholder}
			<p class="text-placeholder absolute inset-x-4 top-3 select-none">
				<T message={placeholder} />
			</p>
		{/if}

		{#if editor.init.maxLength}
			{@const remaining = editor.init.maxLength - editor.contentLength}
			<p
				class={[
					'absolute bottom-1 right-3',
					remaining < 50
						? 'text-red-500'
						: remaining < 200
							? 'text-yellow-500'
							: 'text-on-surface-dim',
				]}
			>
				{remaining}
			</p>
		{/if}
	</div>
</div>
