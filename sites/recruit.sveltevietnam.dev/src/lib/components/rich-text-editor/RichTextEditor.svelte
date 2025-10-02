<script lang="ts" module>
	import { TOGGLE_LINK_COMMAND } from '@lexical/link';
	import { HeadingNode } from '@lexical/rich-text';
	import { T } from '@sveltevietnam/i18n/runtime';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import { Dropdown } from '@sveltevietnam/kit/components';
	import type { Status } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { FORMAT_TEXT_COMMAND, REDO_COMMAND, UNDO_COMMAND } from 'lexical';
	import debounce from 'lodash.debounce';
	import { onMount } from 'svelte';
	import { type ClassValue } from 'svelte/elements';
	import { on } from 'svelte/events';

	import * as m from '$data/locales/generated/messages';

	import { CalloutStatusDropdown, FORMAT_CALLOUT_COMMAND } from './callout';
	import { Editor, type HeadingLevel } from './editor.svelte';

	export interface RichTextEditorProps {
		cache?: [area: 'session' | 'local', key: string];
		headings?: [min: HeadingLevel, max: HeadingLevel];
		onchange?: (html: string) => void;
		html?: string;
	}

	function getCachedHtml(cache: RichTextEditorProps['cache']): string | null {
		if (!cache) return null;
		const [area, key] = cache;
		if (area === 'local' && 'localStorage' in globalThis) {
			return localStorage.getItem(key);
		} else if (area === 'session' && 'sessionStorage' in globalThis) {
			return sessionStorage.getItem(key);
		}
		return null;
	}

	function setCachedHtml(html: string, cache: RichTextEditorProps['cache']) {
		if (html && cache) {
			const [area, key] = cache;
			if (area === 'local') {
				localStorage.setItem(key, html);
			} else if (area === 'session') {
				sessionStorage.setItem(key, html);
			}
		}
	}
</script>

<script lang="ts">
	let { onchange, cache, headings = [1, 6], html }: RichTextEditorProps = $props();

	const { routing } = Contexts.get();
	let element: HTMLElement;
	let editor = new Editor(html ?? getCachedHtml(cache));

	onMount(() => {
		const removeTransform = editor.lexical.registerNodeTransform(HeadingNode, (node) => {
			const level = parseInt(node.getTag().slice(1));
			const [min, max] = headings;
			if (level < min) {
				node.setTag(`h${min}`);
			} else if (level > max) {
				node.setTag(`h${max}`);
			}
		});

		const debouncedSetCachedHtml = debounce(setCachedHtml, 500);
		const offChangeHtml = on(element, 'changehtml', (event) => {
			const html = (event as CustomEvent<{ html: string }>).detail.html;
			onchange?.(html);
			debouncedSetCachedHtml(html, cache);
		});

		return () => {
			removeTransform();
			offChangeHtml();
		};
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

	let isBlockTypeMenuOpen = $state(false);
	function isHeadingReadonly(level: HeadingLevel): boolean {
		const [min, max] = headings;
		return level < min || level > max;
	}
	function setBlockType(type: keyof typeof BLOCKS) {
		isBlockTypeMenuOpen = false;
		BLOCKS[type]?.set?.();
	}
	const BLOCKS: Record<
		string,
		{
			iconClass: string;
			readonly?: boolean;
			label: Message<'string', never> | [Message<'string', never>, string];
			set?: () => void;
		}
	> = {
		paragraph: {
			iconClass: 'i-[ph--paragraph]',
			label: m['components.rich_text_editor.toolbar.block.paragraph'],
			set: () => editor.setSelectionBlockType('paragraph', undefined),
		},
		h1: {
			iconClass: 'i-[ph--text-h-one]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '1'],
			readonly: isHeadingReadonly(1),
			set: () => editor.setSelectionBlockType('heading', { level: 1 }),
		},
		h2: {
			iconClass: 'i-[ph--text-h-two]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '2'],
			readonly: isHeadingReadonly(2),
			set: () => editor.setSelectionBlockType('heading', { level: 2 }),
		},
		h3: {
			iconClass: 'i-[ph--text-h-three]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '3'],
			readonly: isHeadingReadonly(3),
			set: () => editor.setSelectionBlockType('heading', { level: 3 }),
		},
		h4: {
			iconClass: 'i-[ph--text-h-four]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '4'],
			readonly: isHeadingReadonly(4),
			set: () => editor.setSelectionBlockType('heading', { level: 4 }),
		},
		h5: {
			iconClass: 'i-[ph--text-h-five]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '5'],
			readonly: isHeadingReadonly(5),
			set: () => editor.setSelectionBlockType('heading', { level: 5 }),
		},
		h6: {
			iconClass: 'i-[ph--text-h-six]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '6'],
			readonly: isHeadingReadonly(6),
			set: () => editor.setSelectionBlockType('heading', { level: 6 }),
		},
		callout: {
			iconClass: 'i-[ph--bell]',
			label: m['components.rich_text_editor.toolbar.block.callout.name'],
			set: () => editor.setSelectionBlockType('callout', { status: 'info' }),
		},
		'list-bullet': {
			iconClass: 'i-[ph--list-bullets]',
			label: m['components.rich_text_editor.toolbar.block.bullet_list'],
			set: () => editor.setSelectionBlockType('list', { listType: 'bullet' }),
		},
		'list-number': {
			iconClass: 'i-[ph--list-numbers]',
			label: m['components.rich_text_editor.toolbar.block.numbered_list'],
			set: () => editor.setSelectionBlockType('list', { listType: 'number' }),
		},
		quote: {
			iconClass: 'i-[ph--quotes]',
			label: m['components.rich_text_editor.toolbar.block.blockquote'],
			set: () => editor.setSelectionBlockType('quote', undefined),
		},
	};
	function handleSelectStatusDropdown(status: Status) {
		editor.lexical.dispatchCommand(FORMAT_CALLOUT_COMMAND, { status });
	}
	let currentBlock = $derived.by(() => {
		if (editor.block.type === 'heading') {
			console.log(editor.block.props.level);
			return BLOCKS[`h${editor.block.props.level}`];
		}
		if (editor.block.type === 'list') {
			return BLOCKS[`list-${editor.block.props.listType}`];
		}
		return BLOCKS[editor.block.type];
	});
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

		<Dropdown class="group w-fit" direction="up" align="left" bind:open={isBlockTypeMenuOpen}>
			{#snippet label()}
				<span class="c-link-lazy flex items-center gap-2 px-2 py-1 transition-colors">
					<i class="i {currentBlock.iconClass} h-5 w-5"></i>
					<span class="sr-only">
						<T message={m['components.rich_text_editor.toolbar.block.name']} />
					</span>
					<span class="" aria-hidden="true">
						{#if Array.isArray(currentBlock.label)}
							<T message={currentBlock.label[0]} />
							{currentBlock.label[1]}
						{:else}
							<T message={currentBlock.label} />
						{/if}
					</span>
					<i class="i i-[ph--caret-down] h-5 w-5 transition-transform group-open:-rotate-180"></i>
				</span>
			{/snippet}
			{#snippet content()}
				<ul class="border-outline divide-outline bg-surface mb-1 w-max divide-y border">
					{#each Object.entries(BLOCKS).filter(([, item]) => !item.readonly) as [key, { iconClass, label }] (key)}
						<li>
							<button
								class="current:text-primary current:font-bold hover:bg-primary-surface flex w-full cursor-pointer
								items-center gap-4 px-4 py-2 -outline-offset-1"
								type="button"
								onclick={setBlockType.bind(null, key)}
							>
								<i class="i {iconClass} h-5 w-5"></i>
								<span>
									{#if Array.isArray(label)}
										<T message={label[0]} />
										{label[1]}
									{:else}
										<T message={label} />
									{/if}
								</span>
							</button>
						</li>
					{/each}
				</ul>
			{/snippet}
		</Dropdown>

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

	<!-- composer -->
	<div
		class="prose z-1 min-h-80 max-w-full px-4 py-3 outline-none"
		bind:this={element}
		contenteditable
		{...editor.attach(() => routing.lang)}
	></div>
</div>
