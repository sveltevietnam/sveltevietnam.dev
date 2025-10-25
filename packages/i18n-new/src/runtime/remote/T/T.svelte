<script lang="ts" module>
	// @ts-expect-error alias set up by vite plugin
	import { mode } from '$i18n/constants.js';
	import type { $$Runtime } from '@sveltevietnam/i18n-new/generated';

	if (mode !== 'remote') {
		throw new Error(
			'(sveltevietnam/i18n-new) Remote T component can only be used in "remote" mode. Please refer to the documentation.',
		);
	}

	type MessageMap = ReturnType<$$Runtime>['mapping'];
	type Key = keyof MessageMap;
	type Language = ReturnType<$$Runtime>['languages'][number];
</script>

<!-- eslint-disable-next-line @typescript-eslint/no-explicit-any -->
<script lang="ts" generics="K extends Key">
	import defaultSanitize from 'sanitize-html';

	import type { MessageQueryInput } from '@sveltevietnam/i18n-new/factory';

	import type { RemoteTProps } from '../..';
	import { I18NContext } from '../../Provider/context.js';

	let { key, lang, sanitize, ...params }: RemoteTProps<K> = $props();
	const context = I18NContext.get();

	let rLang = $derived<string>(lang ?? context.lang());
	let rSanitize = $derived(
		sanitize ??
			context.sanitize ??
			((content: string) =>
				defaultSanitize(content, {
					allowedAttributes: {
						'*': ['class', 'data-*'],
						a: ['href', 'target', 'rel'],
					},
				})),
	);

	// @ts-expect-error alias set up by vite plugin
	const t = (await import('$i18n/t.remote.js')).t as (
		input: MessageQueryInput<MessageMap, Language, Key>,
	) => Promise<string>;

	let translated = $derived(
		await t({
			key: key,
			lang: rLang,
			params: params,
		} as MessageQueryInput<MessageMap, Language, Key>),
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html rSanitize(translated)}
