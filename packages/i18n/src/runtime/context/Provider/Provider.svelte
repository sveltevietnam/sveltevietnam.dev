<script lang="ts" generics="Mo extends 'static' | 'remote' = Mode, L extends string = Language">
	import type { Language, Mode } from '@sveltevietnam/i18n/generated';

	import { Context } from '../context/index.svelte.js';

	import type { ProviderProps } from './Provider.svelte.d.ts';

	let { children, ...rest }: ProviderProps<Mo, L> = $props();

	Context.set(() => rest);
</script>

{@render children?.()}
