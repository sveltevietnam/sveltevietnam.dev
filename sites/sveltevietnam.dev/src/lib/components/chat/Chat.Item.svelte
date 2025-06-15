<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import { Avatar } from '$lib/components/avatar';

	import { type ChatParticipant, type ChatDisplay, getChatContext } from './context';

	let {
		align = 'left',
		display,
		participant,
		children,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLLIElement> & {
		participant?: MaybePromise<ChatParticipant> | string;
		/** @default 'left' */
		align?: 'left' | 'right';
		/** @default 'bubble' */
		display?: ChatDisplay;
	} = $props();

	const { participants, display: displayFromContext } = getChatContext();
	let person = $derived.by(() => {
		if (typeof participant === 'string') {
			return participants?.[participant];
		}
		return participant;
	});
	let rDisplay = $derived(display || displayFromContext || 'bubble');
</script>

{#snippet avatar(name = 'Svelte Vietnam', src?: string | Picture)}
	<Avatar class="border-on-surface h-10 w-10 border-2" {src} {name} height="40" width="40" />
{/snippet}

<li
	class={[
		"c-text-bubble relative",
		align === 'right' && 'c-text-bubble--right',
		rDisplay === 'box' && 'c-text-bubble--box',
		rDisplay === 'bubble' && 'mb-10',
		cls
	]}
	data-align={align}
	data-display={rDisplay}
	{...rest}
>
	{#if person}
		{#await person then p}
			<div
				class={[
					'_avatar absolute w-fit',
					rDisplay === 'box' && `-top-5 ${align === 'left' ? '-left-5' : '-right-5'}`,
					rDisplay === 'bubble' && `-bottom-11.5 ${align === 'left' ? 'left-(--arrow-x)' : 'right-(--arrow-x)'}`,
				]}
			>
				{#if p.href}
					<a class="contents" href={p.href}>
						{@render avatar(p?.name, p?.avatar)}
					</a>
				{:else}
					{@render avatar(p?.name, p?.avatar)}
				{/if}
			</div>
		{/await}
	{/if}

	{@render children?.()}
</li>

<style lang="postcss">
	.c-text-bubble {
		padding-inline: 1.5rem;

		& :global(picture) {
			margin: 0;
			padding: 0;
		}

		&
			:global(
				:is(p, blockquote, .c-callout):not(
						:where([class~='not-prose'], [class~='not-prose'] *, .c-callout *)
					)
			) {
			margin-block: 1rem;
		}
	}

	._avatar {
		.c-text-bubble[data-display="bubble"][data-align="left"] & {
			left: calc(var(--arrow-x) + var(--arrow-width) / 2);
			transform: translateX(-50%);
		}

		.c-text-bubble[data-display="bubble"][data-align="right"] & {
			right: calc(var(--arrow-x) + var(--arrow-width) / 2);
			transform: translateX(50%);
		}
	}
</style>
