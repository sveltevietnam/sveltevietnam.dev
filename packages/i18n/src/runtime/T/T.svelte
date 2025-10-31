<script lang="ts" module>
	import type { Key } from '@sveltevietnam/i18n/generated';

	import { Context } from '../context';
	import type { Message } from '../types.public';

	import MaybeHtml from './MaybeHtml.svelte';

	import type { RemoteTProps, StaticTProps } from '.';
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="K extends Key, M extends Message">
	let {
		key,
		message,
		lang,
		sanitize,
		params,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}: StaticTProps<M> & RemoteTProps<K> & { params: any } = $props();

	const context = Context.get();
	if (!context) {
		throw new Error("T component must live within a `import('@sveltevietnam/i18n').Context`");
	}

	let options = $derived({ lang, sanitize });

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let maybeFetched = $derived((context.t as any)({ key, message, params, options }));
</script>

<MaybeHtml content={typeof maybeFetched === 'string' ? maybeFetched : await maybeFetched} />
