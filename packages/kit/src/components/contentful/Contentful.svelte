<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="Attributes extends Record<string, any>">
	import { T } from '@sveltevietnam/i18n-new';

	import type { ContentfulProps } from '.';

	let { prop, tag, ...rest }: ContentfulProps<Attributes> = $props();
</script>

{#if typeof prop === 'string'}
	<svelte:element this={tag} {...rest}>
		{prop}
	</svelte:element>
{:else if prop[0] === 'snippet'}
	{@const { snippet, params } = prop[1]}
	{@render snippet(params)}
{:else if prop[0] === 'extend'}
	{@const { content, attributes = {} } = prop[1]}
	<svelte:element this={tag} {...rest} {...attributes}>
		{#if typeof content === 'string'}
			{content}
		{:else}
			<T key={prop[1]} />
		{/if}
	</svelte:element>
{:else}
	<T key={prop[1]} />
{/if}
