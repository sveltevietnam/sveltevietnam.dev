<script lang="ts">
	import { autoUpdate, computePosition, offset, shift, flip } from '@floating-ui/dom';
	import { onMount } from 'svelte';

	import type { DropdownPopoverProps } from '.';

	function generateID() {
		if (typeof crypto !== 'undefined' && crypto.randomUUID) {
			return crypto.randomUUID();
		}
		return Math.random().toString(36).substring(2, 9);
	}

	let {
		placement = 'bottom-end',
		label,
		offset: offsetOptions = { mainAxis: 8 },
		content,
		open = $bindable(false),
		id = generateID(),
		...rest
	}: DropdownPopoverProps = $props();

	let control: HTMLButtonElement;
	let target: HTMLDivElement;
	function handleBeforeToggle(e: ToggleEvent) {
		open = e.newState === 'open';
	}
	$effect(() => {
		// sync the HTML and JS open state
		if (open !== target.matches(':popover-open')) {
			target.togglePopover(open);
		}
	});

	onMount(() => {
		return autoUpdate(control, target, async () => {
			const { x, y } = await computePosition(control, target, {
				placement,
				middleware: [
					offset(offsetOptions),
					flip({
						fallbackAxisSideDirection: 'start',
						crossAxis: false,
					}),
					shift(),
				],
			});
			target.style.left = `${x}px`;
			target.style.top = `${y}px`;
		});
	});
</script>

<button
	type="button"
	bind:this={control}
	popovertargetaction="toggle"
	popovertarget={id}
	role="combobox"
	aria-controls={id}
	aria-expanded={open}
	{...rest}
>
	{@render label?.()}
</button>

<div
	class="shadow-on-surface/20 absolute overflow-visible shadow-md"
	{id}
	bind:this={target}
	popover="auto"
	role="listbox"
	onbeforetoggle={handleBeforeToggle}
>
	{@render content?.()}
</div>
