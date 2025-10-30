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

	const { t } = Context.get();

	let options = $derived({ lang, sanitize });

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let maybeFetched = $derived((t as any)({ key, message, params, options }));
</script>

<MaybeHtml content={typeof maybeFetched === 'string' ? maybeFetched : await maybeFetched} />
