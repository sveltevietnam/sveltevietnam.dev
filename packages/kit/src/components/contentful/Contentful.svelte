<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="Attributes extends Record<string, any>">
	import { T } from '@sveltevietnam/i18n';

	import type { ContentfulProps } from '.';

	let { content, tag, ...rest }: ContentfulProps<Attributes> = $props();
</script>

{#if typeof content === 'string'}
	<svelte:element this={tag} {...rest}>
		{content}
	</svelte:element>
{:else if content[0] === 'snippet'}
	{@const { snippet, params } = content[1]}
	{@render snippet(params)}
{:else if content[0] === 'extend'}
	{@const { content: extendedContent, attributes = {} } = content[1]}
	<svelte:element this={tag} {...rest} {...attributes}>
		{#if typeof extendedContent === 'string'}
			{extendedContent}
		{:else}
			<T key={extendedContent[1]} />
		{/if}
	</svelte:element>
{:else}
	<svelte:element this={tag} {...rest}>
		<T key={content[1]} />
	</svelte:element>
{/if}
