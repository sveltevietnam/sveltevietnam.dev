<script lang="ts" module>
	import { TOGGLE_LINK_COMMAND } from '@lexical/link';
	import { FORMAT_TEXT_COMMAND } from 'lexical';

	import * as m from '$data/locales/generated/messages';

	import type { Editor } from '..';

	import ToolbarIconButton from './ToolbarIconButton.svelte';

	export interface ToolbarInlineToolsProps {
		editor: Editor;
	}
</script>

<script lang="ts">
	let { editor }: ToolbarInlineToolsProps = $props();

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

	let tools = {
		bold: {
			iconClass: 'i-[ph--text-b-bold]',
			label: m['components.rich_text_editor.toolbar.inline.bold'],
			action: toggleBold,
			isActive: () => editor.inline.format.bold,
		},
		italic: {
			iconClass: 'i-[ph--text-italic]',
			label: m['components.rich_text_editor.toolbar.inline.italic'],
			action: toggleItalic,
			isActive: () => editor.inline.format.italic,
		},
		underline: {
			iconClass: 'i-[ph--text-underline]',
			label: m['components.rich_text_editor.toolbar.inline.underline'],
			action: toggleUnderline,
			isActive: () => editor.inline.format.underline,
		},
		code: {
			iconClass: 'i-[ph--code-simple]',
			label: m['components.rich_text_editor.toolbar.inline.code'],
			action: toggleInlineCodeBlock,
			isActive: () => editor.inline.format.code,
		},
		link: {
			iconClass: 'i-[ph--link-simple-horizontal]',
			label: m['components.rich_text_editor.toolbar.inline.link'],
			action: insertLink,
			isActive: () => editor.inline.link !== null,
		},
	};
</script>

<ul class="contents">
	{#each Object.entries(tools) as [key, tool] (key)}
		<li>
			<ToolbarIconButton
				iconClass={tool.iconClass}
				label={tool.label}
				active={tool.isActive()}
				onclick={tool.action}
			/>
		</li>
	{/each}
</ul>
