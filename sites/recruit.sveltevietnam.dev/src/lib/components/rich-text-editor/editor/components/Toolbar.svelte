<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n/runtime';
	import type { Status } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { REDO_COMMAND, UNDO_COMMAND } from 'lexical';

	import * as m from '$data/locales/generated/messages';

	import type { Editor } from '..';
	import { CalloutStatusDropdown, FORMAT_CALLOUT_COMMAND } from '../plugins/callout';

	import DialogHelp from './DialogHelp.svelte';
	import ToolbarBlockTools from './ToolbarBlockTools.svelte';
	import ToolbarIconButton from './ToolbarIconButton.svelte';
	import ToolbarInlineTools from './ToolbarInlineTools.svelte';

	export interface ToolbarProps {
		editor: Editor;
	}
</script>

<script lang="ts">
	import type { ClassValue } from 'svelte/elements';

	let { editor }: ToolbarProps = $props();

	const { dialogs } = Contexts.get();

	function undo() {
		editor.lexical.dispatchCommand(UNDO_COMMAND, undefined);
	}

	function redo() {
		editor.lexical.dispatchCommand(REDO_COMMAND, undefined);
	}

	function help() {
		dialogs.push('custom', { component: DialogHelp });
	}

	function handleSelectStatusDropdown(status: Status) {
		editor.lexical.dispatchCommand(FORMAT_CALLOUT_COMMAND, { status });
	}
</script>

<div
	class="border-y-onehalf bg-surface-subtle z-2 max-w-pad-content sticky bottom-0 flex items-center gap-0.5 overflow-auto border-current p-0.5"
	role="toolbar"
	aria-labelledby="rich-text-toolbar-label"
>
	<p class="sr-only" id="rich-text-toolbar-label">
		<T message={m['components.rich_text_editor.toolbar.name']} />
	</p>

	{#snippet separator(classes?: ClassValue)}
		<div class={['bg-outline flex w-px shrink-0 self-stretch', classes]}></div>
	{/snippet}

	<!-- undo -->
	<ToolbarIconButton
		iconClass="i-[ph--arrow-counter-clockwise]"
		label={m['components.rich_text_editor.toolbar.undo']}
		onclick={undo}
	/>
	<!-- redo -->
	<ToolbarIconButton
		iconClass="i-[ph--arrow-clockwise]"
		label={m['components.rich_text_editor.toolbar.redo']}
		onclick={redo}
	/>

	{@render separator('ml-2')}

	<ToolbarBlockTools {editor} />

	{@render separator('mr-2')}

	<ToolbarInlineTools {editor} />

	{@render separator('ml-auto')}

	{#if editor.block.type === 'callout'}
		<CalloutStatusDropdown
			status={editor.block.props.status}
			onselect={handleSelectStatusDropdown}
		/>
		{@render separator()}
	{/if}

	<!-- open help dialog -->
	<ToolbarIconButton
		iconClass="i-[ph--question-mark]"
		label={m['components.rich_text_editor.toolbar.help']}
		onclick={help}
	/>
</div>
