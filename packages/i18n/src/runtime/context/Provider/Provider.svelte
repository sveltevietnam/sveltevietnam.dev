<script lang="ts">
	import { Context } from '../context/index.svelte.js';

	import type { ProviderProps } from './Provider.svelte.d.ts';

	let { children, lang, sanitize }: ProviderProps = $props();

	Context.set(() => ({ lang, sanitize }));
</script>

{@render children()}
