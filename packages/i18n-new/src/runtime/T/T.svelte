<script lang="ts" generics="M extends import('..').Message">
	import defaultSanitize from 'sanitize-html';

	import { I18NContext } from '../Provider/context.js';

	let { message, sanitize, lang, ...params }: import('./T.svelte.d.ts').MessageProps<M> = $props();
	const context = I18NContext.get();

	let rLang = $derived(lang ?? (context.lang() as M['$$l']));
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
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html rSanitize(message(rLang, params as unknown as M['$$p']))}
