<!-- eslint-disable @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="Attributes extends Record<string, any>">
	import { T } from '@sveltevietnam/i18n';
	import { isMessage } from '@sveltevietnam/i18n/runtime';

	import type { ContentfulProps } from '.';

	let { prop, tag, ...rest }: ContentfulProps<Attributes> = $props();
</script>

{#if isMessage(prop)}
	<svelte:element this={tag} {...rest}>
		<T message={prop} />
	</svelte:element>
{:else if typeof prop === 'string'}
	<svelte:element this={tag} {...rest}>
		{prop}
	</svelte:element>
{:else if 'content' in prop}
	{@const { content, attributes = {} } = prop}
	<svelte:element this={tag} {...rest} {...attributes}>
		{#if isMessage(content)}
			<T message={content} />
		{:else}
			{content}
		{/if}
	</svelte:element>
{:else}
	{@const { snippet, params } = prop}
	{@render snippet(params)}
{/if}
