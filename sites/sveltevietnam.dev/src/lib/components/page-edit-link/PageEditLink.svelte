<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import { HintedText } from '$lib/components/hinted-text';

	let {
		locale,
		href,
		class: cls,
		...rest
	}: {
		href: string;
		locale: import('./locales/generated').Locale;
	} & HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={['max-w-pad c-text-body-sm py-2 text-right', cls]} {...rest}>
	<a class="c-link" {href} data-external>
		<T message={locale.link} />
	</a>
	<HintedText class="ml-1 cursor-help">
		<i class="i i-[info] h-5 w-5"></i>
		{#snippet hint()}
			<T message={locale.description} />
		{/snippet}
	</HintedText>
</p>
