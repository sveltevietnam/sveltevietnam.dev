<script lang="ts" module>
	import { getContext, setContext, Snippet } from 'svelte';

	import type { LocalesContextValue } from './LocalesContext.svelte.d.ts';

	export const CONTEXT_KEY = 'enhanced:codeblock:locales';

	export function getLocalesContext() {
		return (
			getContext<LocalesContextValue>(CONTEXT_KEY) ?? {
				copy: 'Copy',
				collapse: 'Collapse',
				expand: 'Expand',
				maximize: 'Maximize',
				minimize: 'Minimize',
			}
		);
	}
</script>

<script lang="ts">
	let {
		children,
		...rest
	}: LocalesContextValue & {
		children: Snippet;
	} = $props();

	setContext<LocalesContextValue>('locales', {
		...rest,
	});
</script>

{@render children()}
