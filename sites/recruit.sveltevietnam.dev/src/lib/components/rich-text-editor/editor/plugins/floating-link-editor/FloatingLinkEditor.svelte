<script lang="ts" module>
	import { autoUpdate, computePosition, shift, flip, offset } from '@floating-ui/dom';
	import { T, type Message } from '@sveltevietnam/i18n/runtime';
	import { getContext, onMount } from 'svelte';

	export interface FloatingLinkEditorProps {
		trigger: HTMLElement;
		/** @bindable */
		editing?: boolean;
		initialValue?: string;
		onsaved?: (text: string) => void;
		ondiscard?: (text: string) => void;
		onremoved?: (text: string) => void;
		onclosed?: (text: string) => void;
		i18n: {
			name: Message<'string', never>;
			edit: Message<'string', never>;
			remove: Message<'string', never>;
			save: Message<'string', never>;
			discard: Message<'string', never>;
			placeholder: Message<'string', never>;
		};
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
		i18n,
		trigger,
	}: FloatingLinkEditorProps = $props();

	let getLang = getContext<() => string>('t:lang');
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
	class="border-onehalf bg-surface shadow-brutal max-w-screen invisible absolute min-h-10 min-w-40 border-current"
	popover="manual"
	bind:this={popover}
	ontoggle={handleToggle}
	role="dialog"
	aria-labelledby="floating-link-editor-label"
>
	<p class="sr-only" id="floating-link-editor-label">
		<T message={i18n.name} />
	</p>

	{#if editing}
		<input
			bind:this={input}
			placeholder={i18n.placeholder(getLang()).toString()}
			class="w-100 block max-w-full py-2 pl-3 pr-20"
			type="text"
			bind:value
		/>
	{:else}
		<p class="py-2 pl-3 pr-20">
			<a class="c-link" href={value} target="_blank" rel="noreferrer noopener external">
				{value}
			</a>
		</p>
	{/if}

	{#snippet action(iconClass: string, sr: Message<'string', never>, onclick: () => void)}
		<button class="c-btn c-btn--icon p-1.5" type="button" {onclick}>
			<i class="i {iconClass} h-5 w-5"></i>
			<span class="sr-only">
				<T message={sr} />
			</span>
		</button>
	{/snippet}

	<!-- actions -->
	<div class="absolute right-1 top-1/2 flex -translate-y-1/2 gap-0.5">
		{#if editing}
			{@render action('i-[ph--check]', i18n.save, handleSave)}
			{@render action('i-[ph--x]', i18n.discard, handleDiscard)}
		{:else}
			{@render action('i-[ph--pencil-simple]', i18n.edit, handleEdit)}
			{@render action('i-[ph--trash]', i18n.remove, handleRemove)}
		{/if}
	</div>
</div>
