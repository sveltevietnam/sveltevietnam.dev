<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n/runtime';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import { DropdownPopover } from '@sveltevietnam/kit/components';

	import * as m from '$data/locales/generated/messages';

	import type { Editor, HeadingLevel } from '..';

	export interface ToolbarBlockToolsProps {
		editor: Editor;
	}

	const blocks: Record<
		string,
		{
			iconClass: string;
			label: Message<'string', never> | [Message<'string', never>, string];
		}
	> = {
		paragraph: {
			iconClass: 'i-[ph--paragraph]',
			label: m['components.rich_text_editor.toolbar.block.paragraph'],
		},
		h1: {
			iconClass: 'i-[ph--text-h-one]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '1'],
		},
		h2: {
			iconClass: 'i-[ph--text-h-two]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '2'],
		},
		h3: {
			iconClass: 'i-[ph--text-h-three]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '3'],
		},
		h4: {
			iconClass: 'i-[ph--text-h-four]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '4'],
		},
		h5: {
			iconClass: 'i-[ph--text-h-five]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '5'],
		},
		h6: {
			iconClass: 'i-[ph--text-h-six]',
			label: [m['components.rich_text_editor.toolbar.block.heading'], '6'],
		},
		callout: {
			iconClass: 'i-[ph--bell]',
			label: m['components.rich_text_editor.toolbar.block.callout.name'],
		},
		'list-bullet': {
			iconClass: 'i-[ph--list-bullets]',
			label: m['components.rich_text_editor.toolbar.block.bullet_list'],
		},
		'list-number': {
			iconClass: 'i-[ph--list-numbers]',
			label: m['components.rich_text_editor.toolbar.block.numbered_list'],
		},
		quote: {
			iconClass: 'i-[ph--quotes]',
			label: m['components.rich_text_editor.toolbar.block.blockquote'],
		},
	};
</script>

<!-- TODO: add tooltip on hover with more info for each action -->
<script lang="ts">
	let { editor }: ToolbarBlockToolsProps = $props();
	let open = $state(false);

	let currentBlock = $derived.by(() => {
		if (editor.block.type === 'heading') {
			return blocks[`h${editor.block.props.level}`];
		}
		if (editor.block.type === 'list') {
			return blocks[`list-${editor.block.props.listType}`];
		}
		return blocks[editor.block.type];
	});

	let writableBlockEntries = $derived.by(() => {
		const entries = Object.entries(blocks);
		const filtered: typeof entries = [];
		for (const [type, block] of entries) {
			if (type.startsWith('h') && type.length === 2) {
				const [min, max] = editor.init.headings ?? [1, 6];
				const level = Number(type[1]) as HeadingLevel;
				if (level < min || level > max) {
					continue;
				}
			}
			filtered.push([type, block]);
		}
		return filtered;
	});

	function setBlockType(type: keyof typeof blocks) {
		open = false;
		// blocks[type]?.set?.();
		switch (type) {
			case 'h1':
			case 'h2':
			case 'h3':
			case 'h4':
			case 'h5':
			case 'h6':
				return editor.setSelectionBlockType('heading', { level: Number(type[1]) as HeadingLevel });
			case 'list-bullet':
			case 'list-number':
				return editor.setSelectionBlockType('list', {
					listType: type.slice(5) as 'bullet' | 'number',
				});
			case 'quote':
				return editor.setSelectionBlockType('quote', undefined);
			case 'callout':
				return editor.setSelectionBlockType('callout', { status: 'info' });
			case 'paragraph':
			default:
				return editor.setSelectionBlockType('paragraph', undefined);
		}
	}
</script>

<DropdownPopover class="group w-fit" placement="top-start" offset={{ mainAxis: 8, crossAxis: -4 }} bind:open>
	{#snippet label()}
		<span class="c-link-lazy flex items-center gap-2 px-2 py-1 transition-colors">
			<i class="i {currentBlock.iconClass} h-5 w-5 shrink-0"></i>
			<span class="sr-only">
				<T message={m['components.rich_text_editor.toolbar.block.name']} />
			</span>
			<span class="mobile:hidden" aria-hidden="true">
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
		<ul class="border-outline divide-outline bg-surface w-max divide-y border">
			{#each writableBlockEntries as [key, { iconClass, label }] (key)}
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
</DropdownPopover>
