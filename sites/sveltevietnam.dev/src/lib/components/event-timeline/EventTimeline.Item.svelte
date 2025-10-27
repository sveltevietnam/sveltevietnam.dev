<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { generateTimeSlot } from '$data/events';

	let {
		class: cls,
		startDate,
		offsetMinutes,
		numMinutes,
		heading,
		content,
		...rest
	}: HTMLAttributes<HTMLLIElement> & {
		heading: Snippet<[]> | string;
		content?: Snippet<[]>;
		startDate?: Date | string;
		offsetMinutes: number;
		numMinutes: number;
	} = $props();
</script>

<li
	class={[
		'tablet:px-8 odd:bg-surface-variant/50 even:bg-surface-variant/10 relative space-y-4 border-b border-dashed px-6 py-6',
		cls,
	]}
	{...rest}
>
	<div class="_dot absolute rounded-full bg-current"></div>
	{#if startDate}
		<div class="text-on-surface-subtle flex items-baseline justify-between">
			<p class="c-text-body-sm">{generateTimeSlot(startDate, offsetMinutes, numMinutes)}</p>
			<p class="c-text-body-xs">{numMinutes} <T key="minutes" /></p>
		</div>
	{/if}
	<div class="space-y-4">
		<h3 class="c-text-title-sm">
			{#if typeof heading === 'string'}
				{heading}
			{:else}
				{@render heading()}
			{/if}
		</h3>
		{#if content}
			{@render content()}
		{/if}
	</div>
</li>

<style>
	._dot {
		--size: 0.5rem; /* 8px */

		top: calc(50% - var(--size) / 2);
		left: calc(-1 * var(--pl) - var(--size) / 2);
		width: var(--size);
		height: var(--size);
	}
</style>
