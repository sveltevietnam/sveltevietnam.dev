<script lang="ts" generics="L extends string, K extends string, P extends string | never">
	import defaultSanitize from 'sanitize-html';

	import { I18NContext } from '../Provider/context.js';

	let { message, sanitize, lang, ...params }: import('./T.svelte.d.ts').MessageProps<L, K, P> =
		$props();
	const context = I18NContext.get();

	let rLang = $derived(lang ?? (context.lang() as L));
	let rSanitize = $derived(
		sanitize ??
			context.sanitize ??
			((content: string) =>
				defaultSanitize(content, {
					allowedAttributes: {
						'*': ['class'],
						a: ['href', 'target', 'rel'],
					},
				})),
	);
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -->
{@html rSanitize(message(rLang, params as unknown as Record<P, string>))}
