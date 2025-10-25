<script lang="ts" module>
	// @ts-expect-error alias set up by vite plugin
	import { mode } from '$i18n/constants.js';

	if (mode === 'remote') {
		console.warn(
			'\x1b[43m sveltevietnam/i18n-new ⚠ \x1b[0m',
			'\x1b[33m Looks like "remote" mode is enabled but you are still using the static T component. You can switch to remote T from @sveltevietnam/i18n-new/remote. Please refer to the documentation for more information. \x1b[0m',
		);
	}
</script>

<script lang="ts" generics="M extends Message">
	import defaultSanitize from 'sanitize-html';

	import type { Message, StaticTProps } from '..';
	import { I18NContext } from '../Provider/context.js';

	let { message, lang, sanitize, ...params }: StaticTProps<M> = $props();
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

	let translated = $derived(message(rLang, params as M['$$p']));
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html rSanitize(translated)}
