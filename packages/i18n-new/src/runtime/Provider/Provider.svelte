<script lang="ts">
	import { I18NContext } from './context.js';

	import type { ProviderProps } from '.';

	let { children, lang, sanitize }: ProviderProps = $props();

	I18NContext.set({ lang: () => lang, sanitize });
</script>

{@render children()}
