<script lang="ts">
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import type { HTMLAttributes } from 'svelte/elements';

	import { getPersonById } from '$data/people';
	import * as p from '$data/routes/generated';
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
		participant?: ChatParticipant | string;
		/** @default 'left' */
		align?: 'left' | 'right';
		/** @default 'bubble' */
		display?: ChatDisplay;
	} = $props();

	const routing = RoutingContext.get();
	const { display: displayFromContext } = getChatContext();

	let rDisplay = $derived(display || displayFromContext || 'bubble');

	async function resolveParticipant(
		participant?: ChatParticipant | string,
	): Promise<ChatParticipant | null> {
		if (!participant) return null;
		if (typeof participant !== 'string') return participant;
		const person = await getPersonById({
			id: participant,
			lang: routing.lang,
			optionalModules: { avatar: true },
		});
		return {
			id: person.id,
			name: person.name,
			avatar: person.avatar,
			href: p['/:lang/people/:id']({ lang: routing.lang, id: person.id }),
		};
	}
	let rParticipant = $derived(await resolveParticipant(participant));
</script>

<li
	class={[
		'c-text-bubble relative',
		align === 'right' && 'c-text-bubble--right',
		rDisplay === 'box' && 'c-text-bubble--box',
		rDisplay === 'bubble' && 'mb-10',
		cls,
	]}
	data-align={align}
	data-display={rDisplay}
	{...rest}
>
	{#if rParticipant}
		<div
			class={[
				'_avatar absolute w-fit',
				rDisplay === 'box' && `-top-5 ${align === 'left' ? '-left-5' : '-right-5'}`,
				rDisplay === 'bubble' &&
					`-bottom-11.5 ${align === 'left' ? 'left-(--arrow-x)' : 'right-(--arrow-x)'}`,
			]}
		>
			{#if rParticipant.href}
				<a class="contents" href={rParticipant.href}>
					<Avatar
						class="border-on-surface h-10 w-10 border-2"
						height="40"
						width="40"
						name={rParticipant.name}
						src={rParticipant.avatar}
					/>
				</a>
			{:else}
				<Avatar
					class="border-on-surface h-10 w-10 border-2"
					height="40"
					width="40"
					name={rParticipant.name}
					src={rParticipant.avatar}
				/>
			{/if}
		</div>
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
		.c-text-bubble[data-display='bubble'][data-align='left'] & {
			left: calc(var(--arrow-x) + var(--arrow-width) / 2);
			transform: translateX(-50%);
		}

		.c-text-bubble[data-display='bubble'][data-align='right'] & {
			right: calc(var(--arrow-x) + var(--arrow-width) / 2);
			transform: translateX(50%);
		}
	}
</style>
