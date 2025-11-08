<script lang="ts" module>
	import type { Key } from '@sveltevietnam/i18n/generated';

	import { Context, type RemoteTranslate } from '../context';
	import type { Message } from '../types.public';

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
	let t = $derived(context.t as RemoteTranslate);

	let translated = $derived<string>(
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		await t({ key, message, params, lang, sanitize, remote } as any),
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html translated}
