<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { generateTimeSlot } from '$data/events';
	import * as m from '$data/locales/generated/messages';

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
		startDate: Date;
		offsetMinutes: number;
		numMinutes: number;
	} = $props();
</script>

<li class={['relative py-6 px-6 tablet:px-8 odd:bg-surface-variant/50 even:bg-surface-variant/10 border-dashed border-b space-y-4', cls]} {...rest}>
	<div class="bg-current rounded-full absolute _dot"></div>
	<div class="flex items-baseline justify-between text-on-surface-subtle">
		<p class="c-text-body-sm">{generateTimeSlot(startDate, offsetMinutes, numMinutes)}</p>
		<p class="c-text-body-xs">{numMinutes} <T message={m['minutes']} /></p>
	</div>
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
