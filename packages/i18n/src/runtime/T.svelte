<script lang="ts" generics="M extends import('./types.public.js').Message">
	import { getContext } from 'svelte';

	let {
		message,
		lang: langFromProp,
		...rest
	}: {
		message: M;
		lang?: string;
	} & Record<keyof ReturnType<M>['$p'], string> = $props();

	let getLang = getContext<() => string>('t:lang');
	let [iMessage, params] = $derived([
		message(langFromProp ?? getLang()),
		rest as unknown as Record<keyof ReturnType<M>['$p'], string>,
	]);
</script>

{#key Object.values(params)}
	{#if iMessage.$t === 'snippet'}
		{@render iMessage(params)}
	{:else if iMessage.$t === 'function'}
		{iMessage(params)}
	{:else}
		{iMessage as unknown as string}
	{/if}
{/key}
