<script lang="ts" module>
	import { autoUpdate, computePosition, shift, flip, offset } from '@floating-ui/dom';
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
		i18n: {
			aria: string;
			placeholder: string;
			edit: string;
			remove: string;
			save: string;
			discard: string;
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
		trigger,
		i18n,
	}: FloatingLinkEditorProps = $props();

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

	function handleSave(event: Event) {
		event.preventDefault();
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
	aria-label={i18n.aria}
>
	<form onsubmit={handleSave}>
		{#if editing}
			<input
				bind:this={input}
				class="block w-100 max-w-full py-2 pr-20 pl-3"
				placeholder={i18n.placeholder}
				type="url"
				bind:value
			/>
		{:else}
			<p class="py-2 pr-20 pl-3">
				<a class="c-link" href={value} target="_blank" rel="noreferrer noopener external">
					{value}
				</a>
			</p>
		{/if}

		<div class="absolute top-1/2 right-1 flex -translate-y-1/2 gap-0.5">
			{#if editing}
				<button class="c-btn c-btn--icon p-1.5" type="submit">
					<i class="i i-[ph--check] h-5 w-5"></i>
					<span class="sr-only">{i18n.save}</span>
				</button>
				<button class="c-btn c-btn--icon p-1.5" type="button" onclick={handleDiscard}>
					<i class="i i-[ph--x] h-5 w-5"></i>
					<span class="sr-only">{i18n.discard}</span>
				</button>
			{:else}
				<button class="c-btn c-btn--icon p-1.5" type="button" onclick={handleEdit}>
					<i class="i i-[ph--pencil-simple] h-5 w-5"></i>
					<span class="sr-only">{i18n.edit}</span>
				</button>
				<button class="c-btn c-btn--icon p-1.5" type="button" onclick={handleRemove}>
					<i class="i i-[ph--trash] h-5 w-5"></i>
					<span class="sr-only">{i18n.remove}</span>
				</button>
			{/if}
		</div>
	</form>
</div>
