<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import { Avatar } from '$lib/components/avatar';

	import { type ChatParticipant, getChatContext } from './context';

	let {
		align = 'left',
		participant,
		children,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLLIElement> & {
		participant?: MaybePromise<ChatParticipant> | string;
		/** @default 'left' */
		align?: 'left' | 'right';
	} = $props();

	const { participants } = getChatContext()
	let person = $derived.by(() => {
		if (typeof participant === 'string') {
			return participants?.[participant];
		}
		return participant;
	});
</script>

{#snippet avatar(name = 'Svelte Vietnam', src?: string | Picture)}
	<Avatar
		class={[
			'border-on-surface absolute -top-5 h-10 w-10 border-2',
			align === 'left' && '-left-3 tablet:-left-5',
			align === 'right' && '-right-3 tablet:-right-5',
		]}
		{src}
		{name}
		height="40"
		width="40"
	/>
{/snippet}

<li
	class={['c-text-bubble relative my-0', align === 'right' && 'c-text-bubble--right', cls]}
	{...rest}
	data-align={align}
>
	{#if person}
		{#await person then p}
			{#if p.href}
				<a class="contents" href={p.href}>
					{@render avatar(p?.name, p?.avatar)}
				</a>
			{:else}
				{@render avatar(p?.name, p?.avatar)}
			{/if}
		{/await}
	{/if}
	{@render children?.()}
</li>

<style lang="postcss">
	.c-text-bubble {
		padding-inline: 1.5rem;

		& :global(.c-callout) {
			width: fit-content;
		}

		&[data-align='right'] {
			& :global(.c-callout) {
				margin-left: auto;
			}
		}

		& :global(picture) {
			margin: 0;
			padding: 0;
		}

		& :global(:is(p, blockquote, .c-callout):not(:where([class~="not-prose"], [class~="not-prose"]
		*, .c-callout *))) {
			margin-block: 1rem;
		}
	}
</style>
