<script lang="ts" module>
	import { autoUpdate, computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { T } from '@sveltevietnam/i18n';
	import type { KeySimple } from '@sveltevietnam/i18n/generated';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { onMount } from 'svelte';

	export interface FloatingLinkEditorProps {
		trigger: HTMLElement;
		/** @bindable */
		editing?: boolean;
		initialValue?: string;
		onsaved?: (text: string) => void;
		ondiscard?: (text: string) => void;
		onremoved?: (text: string) => void;
		onclosed?: (text: string) => void;
	}
</script>

<script lang="ts">
	let {
		editing = $bindable(false),
		initialValue = '',
		onsaved,
		onremoved,
		onclosed,
		ondiscard,
		trigger,
	}: FloatingLinkEditorProps = $props();

	const {
		i18n: { t },
	} = Contexts.get();
	let value = $state(initialValue);

	let popover: HTMLElement;
	let input: HTMLInputElement | null = $state(null);

	function handleEdit() {
		editing = true;
	}

	function handleRemove() {
		editing = false;
		value = initialValue;
		onremoved?.(value);
	}

	function handleSave() {
		editing = false;
		onsaved?.(value);
	}

	function handleDiscard() {
		editing = false;
		value = initialValue;
		ondiscard?.(value);
	}

	let cleanup: () => void = () => {};
	function handleToggle(event: ToggleEvent) {
		if (event.newState === 'closed') {
			cleanup();
			return onclosed?.(value);
		}

		cleanup = autoUpdate(trigger, popover, async () => {
			const { x, y } = await computePosition(trigger, popover, {
				placement: 'bottom-start',
				middleware: [
					offset(8),
					flip({
						fallbackAxisSideDirection: 'start',
						crossAxis: false,
					}),
					shift(),
				],
			});
			popover.style.left = `${x}px`;
			popover.style.top = `${y}px`;
			popover.style.visibility = 'visible';
		});
		setTimeout(() => input?.focus(), 0);
	}

	onMount(() => {
		popover.showPopover();
		return () => cleanup();
	});
</script>

<div
	class="border-onehalf bg-surface shadow-brutal invisible absolute min-h-10 max-w-screen min-w-40 border-current"
	popover="manual"
	bind:this={popover}
	ontoggle={handleToggle}
	role="dialog"
	aria-labelledby="floating-link-editor-label"
>
	<p class="sr-only" id="floating-link-editor-label">
		<T key="components.rich_text_editor.floating_link_editor.name" />
	</p>

	{#if editing}
		<input
			bind:this={input}
			placeholder={await t({ key: 'components.rich_text_editor.floating_link_editor.placeholder' })}
			class="block w-100 max-w-full py-2 pr-20 pl-3"
			type="text"
			bind:value
		/>
	{:else}
		<p class="py-2 pr-20 pl-3">
			<a class="c-link" href={value} target="_blank" rel="noreferrer noopener external">
				{value}
			</a>
		</p>
	{/if}

	{#snippet action(iconClass: string, sr: KeySimple, onclick: () => void)}
		<button class="c-btn c-btn--icon p-1.5" type="button" {onclick}>
			<i class="i {iconClass} h-5 w-5"></i>
			<span class="sr-only">
				<T key={sr} />
			</span>
		</button>
	{/snippet}

	<!-- actions -->
	<div class="absolute top-1/2 right-1 flex -translate-y-1/2 gap-0.5">
		{#if editing}
			{@render action(
				'i-[ph--check]',
				'components.rich_text_editor.floating_link_editor.save',
				handleSave,
			)}
			{@render action(
				'i-[ph--x]',
				'components.rich_text_editor.floating_link_editor.discard',
				handleDiscard,
			)}
		{:else}
			{@render action(
				'i-[ph--pencil-simple]',
				'components.rich_text_editor.floating_link_editor.edit',
				handleEdit,
			)}
			{@render action(
				'i-[ph--trash]',
				'components.rich_text_editor.floating_link_editor.remove',
				handleRemove,
			)}
		{/if}
	</div>
</div>
