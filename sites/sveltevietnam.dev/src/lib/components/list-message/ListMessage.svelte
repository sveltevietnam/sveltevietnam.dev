<script lang="ts" generics="T">
	import { T } from '@sveltevietnam/i18n';
	import type { Snippet } from 'svelte';

	import * as m from '$data/locales/generated/messages';

	let {
		items,
		item,
	}: {
		items: T[];
		item: Snippet<[item: T]>;
	} = $props();
</script>

{#each items as _item, i (i)}
	{@render item(_item)}{#if i < items.length - 1}
		{#if i === items.length - 2}
			<span>
				{#if items.length > 2}
					,
				{/if}
				<T message={m.and} />&nbsp;
			</span>
		{:else}
			<span>,&nbsp;</span>
		{/if}
	{/if}
{/each}
