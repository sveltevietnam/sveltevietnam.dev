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
		params,
		lang,
		remote,
		sanitize,
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
	}: StaticTProps<M> & RemoteTProps<K> & { params: any } = $props();

	const context = Context.get();
	if (!context) {
		throw new Error("T component must live within a `import('@sveltevietnam/i18n').Context`");
	}

	let maybePromise = $derived<string | Promise<string>>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		(context.t as any)({ key, message, params, lang, sanitize, remote }),
	);
</script>

<MaybeHtml content={await maybePromise} />
