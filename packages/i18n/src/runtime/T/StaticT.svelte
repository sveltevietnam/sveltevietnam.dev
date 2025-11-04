<!--
	@component workaround for 'static' mode, since Svelte "async" is
  still experimental and not turned on by default
-->

<script lang="ts" module>
	import { Context } from '../context';
	import type { Message } from '../types.public';

	import type { StaticTProps } from './types.public';
</script>

<script lang="ts" generics="M extends Message">
	let { message, lang, sanitize, params }: StaticTProps<M> & { params: unknown } = $props();

	const context = Context.get();
	if (!context) {
		throw new Error("T component must live within a `import('@sveltevietnam/i18n').Context`");
	}

	let translated = $derived(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(context.t as any)({ message, params, lang, sanitize }),
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html translated}
