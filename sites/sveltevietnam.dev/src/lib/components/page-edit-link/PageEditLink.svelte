<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { HintedText } from '$lib/components/hinted-text';

	let {
		href,
		class: cls,
		...rest
	}: {
		href: string;
	} & HTMLAttributes<HTMLParagraphElement> = $props();
</script>

<p class={['max-w-pad c-text-body-sm py-2 text-right', cls]} {...rest}>
	<a class="c-link" {href} data-external>
		<T message={m['components.page_edit_link.link']} />
	</a>
	<HintedText class="ml-1 cursor-help">
		<i class="i i-[info] h-5 w-5"></i>
		{#snippet hint()}
			<T message={m['components.page_edit_link.desc']} />
		{/snippet}
	</HintedText>
</p>
