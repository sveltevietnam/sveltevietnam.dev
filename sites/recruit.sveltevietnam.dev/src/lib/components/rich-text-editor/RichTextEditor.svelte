<script lang="ts" module>
	import { TOGGLE_LINK_COMMAND } from '@lexical/link';
	import { T } from '@sveltevietnam/i18n/runtime';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import type { Status } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
	import { onMount } from 'svelte';
	import { type ClassValue } from 'svelte/elements';
	import { on } from 'svelte/events';

	import * as m from '$data/locales/generated/messages';

	import { Editor, type EditorInit } from './editor';
	import ToolbarBlockTools from './editor/components/ToolbarBlockTools.svelte';
	import { CalloutStatusDropdown, FORMAT_CALLOUT_COMMAND } from './editor/plugins/callout';

	export interface RichTextEditorProps extends EditorInit {
		placeholder?: Message<'string', never>;
		onchange?: (html: string) => void;
	}
</script>

<script lang="ts">
	let { onchange, cache, headings = [1, 6], html, placeholder }: RichTextEditorProps = $props();

	const { routing } = Contexts.get();
	let element: HTMLElement;
	let editor = new Editor({ html, headings, cache });

	onMount(() => {
		return on(element, 'changehtml', (event) => {
			onchange?.((event as CustomEvent<{ html: string }>).detail.html);
		});
	});

	function undo() {
		editor.lexical.dispatchCommand(UNDO_COMMAND, undefined);
	}

	function redo() {
		editor.lexical.dispatchCommand(REDO_COMMAND, undefined);
	}

	function toggleBold() {
		editor.lexical.dispatchCommand(FORMAT_TEXT_COMMAND, 'bold');
	}

	function toggleItalic() {
		editor.lexical.dispatchCommand(FORMAT_TEXT_COMMAND, 'italic');
	}

	function toggleUnderline() {
		editor.lexical.dispatchCommand(FORMAT_TEXT_COMMAND, 'underline');
	}

	function toggleInlineCodeBlock() {
		editor.lexical.dispatchCommand(FORMAT_TEXT_COMMAND, 'code');
	}

	function insertLink() {
		if (editor.inline.link === null) {
			editor.lexical.dispatchCommand(TOGGLE_LINK_COMMAND, '');
		} else {
			editor.lexical.dispatchCommand(TOGGLE_LINK_COMMAND, null);
		}
	}

	function help() {}

	function handleSelectStatusDropdown(status: Status) {
		editor.lexical.dispatchCommand(FORMAT_CALLOUT_COMMAND, { status });
	}
</script>

<div class="border-onehalf bg-surface relative flex flex-col-reverse border-current">
	<!-- toolbar -->
	<div
		class="border-y-onehalf bg-surface-subtle z-2 sticky bottom-0 flex items-center gap-0.5 overflow-visible border-current p-0.5"
		role="toolbar"
		aria-labelledby="rich-text-toolbar-label"
	>
		<p class="sr-only" id="rich-text-toolbar-label">
			<T message={m['components.rich_text_editor.toolbar.name']} />
		</p>

		<!-- add tooltip on hover with more info for each action -->
		{#snippet toolbarAction(
			iconClass: string,
			sr: Message<'string', never>,
			onclick: () => void,
			active?: boolean,
		)}
			<button class={['c-btn c-btn--icon p-2', active && 'bg-primary/50']} {onclick} type="button">
				<i class="i {iconClass} h-5 w-5"></i>
				<span class="sr-only">
					<T message={sr} />
				</span>
			</button>
		{/snippet}
		{#snippet separator(classes?: ClassValue)}
			<div class={['bg-outline flex w-px shrink-0 self-stretch', classes]}></div>
		{/snippet}

		<!-- undo -->
		{@render toolbarAction(
			'i-[ph--arrow-counter-clockwise]',
			m['components.rich_text_editor.toolbar.undo'],
			undo,
		)}
		<!-- redo -->
		{@render toolbarAction(
			'i-[ph--arrow-clockwise]',
			m['components.rich_text_editor.toolbar.redo'],
			redo,
		)}

		{@render separator('ml-2')}
		<ToolbarBlockTools {editor} />
		{@render separator('mr-2')}

		<!-- toggle bold -->
		{@render toolbarAction(
			'i-[ph--text-b-bold]',
			m['components.rich_text_editor.toolbar.bold'],
			toggleBold,
			editor.inline.format.bold,
		)}
		<!-- toggle italic -->
		{@render toolbarAction(
			'i-[ph--text-italic]',
			m['components.rich_text_editor.toolbar.italic'],
			toggleItalic,
			editor.inline.format.italic,
		)}
		<!-- toggle underline -->
		{@render toolbarAction(
			'i-[ph--text-underline]',
			m['components.rich_text_editor.toolbar.underline'],
			toggleUnderline,
			editor.inline.format.underline,
		)}
		<!-- toggle inline code block -->
		{@render toolbarAction(
			'i-[ph--code-simple]',
			m['components.rich_text_editor.toolbar.code'],
			toggleInlineCodeBlock,
			editor.inline.format.code,
		)}
		<!-- insert link -->
		{@render toolbarAction(
			'i-[ph--link-simple-horizontal]',
			m['components.rich_text_editor.toolbar.link'],
			insertLink,
			editor.inline.link !== null,
		)}

		{@render separator('ml-auto')}
		{#if editor.block.type === 'callout'}
			<CalloutStatusDropdown
				status={editor.block.props.status}
				onselect={handleSelectStatusDropdown}
			/>
			{@render separator()}
		{/if}

		<!-- open help dialog -->
		{@render toolbarAction(
			'i-[ph--question-mark]',
			m['components.rich_text_editor.toolbar.help'],
			help,
		)}
	</div>

	<div class="z-1 relative">
		<!-- composer -->
		<div
			class="prose h-160 max-w-full overflow-auto px-4 py-3 outline-none"
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
	</div>
</div>
