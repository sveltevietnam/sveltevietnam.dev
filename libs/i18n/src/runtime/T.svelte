<script lang="ts" generics="Params extends string = never">
	// eslint-disable-next-line no-undef
	type P = Params;

	let { message, ...rest }: Record<P, string> & {
		message: import('./types.public.js').Message<P>;
	} = $props();

	const params = rest as unknown as Record<P, string>;
</script>

{#if message.$t === 'snippet'}
	{@render message(params)}
{:else if message.$t === 'function'}
	{message(params)}
{:else}
	{message as unknown as string}
{/if}
