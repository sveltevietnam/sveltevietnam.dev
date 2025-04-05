<script lang="ts" generics="P extends string">
	import { getContext } from 'svelte';

	let {
		message: messageProxy,
		lang: langFromProp,
		...rest
	}: {
		message: (lang: string) => import('./types.public.js').Message<P>;
		lang?: string;
	} & Record<P, string> = $props();

	let getLang = getContext<() => string>('t:lang');
	let lang = $derived(langFromProp ?? getLang());
	let message = $derived(messageProxy(lang));

	const params = rest as unknown as Record<P, string>;
</script>

{#if message.$t === 'snippet'}
	{@render message(params)}
{:else if message.$t === 'function'}
	{message(params)}
{:else}
	{message as unknown as string}
{/if}
