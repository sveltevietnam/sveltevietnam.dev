<script lang="ts" module>
	import type { $$Runtime } from '@sveltevietnam/i18n-new/generated';

	import { Context } from '../context';
	import type { Message } from '../types.public';

	import type { RemoteTProps, StaticTProps } from '.';

	type MessageMap = ReturnType<$$Runtime>['mapping'];
	type Key = keyof MessageMap;
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="K extends Key, M extends Message">
	let { key, message, lang, sanitize, ...params }: RemoteTProps<K> & StaticTProps<M> = $props();

	const { t } = Context.get();

	let options = $derived({ lang, sanitize });

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	let translated = $derived((t as any)({ key, message, params, options }));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html typeof translated === 'string' ? translated : await translated}
