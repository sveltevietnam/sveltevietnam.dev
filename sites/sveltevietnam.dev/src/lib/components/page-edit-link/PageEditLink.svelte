<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

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
	<a
		class="c-link"
		{href}
		data-external
		data-umami-event="click-edit-page-link"
		data-umami-event-url={href}
		data-umami-event-type="page"
	>
		<T key="components.page_edit_link.link" />
	</a>
	<HintedText class="ml-1 cursor-help">
		<span class="sr-only"><T key="explain" /></span>
		<i class="i i-[ph--info] h-5 w-5"></i>
		{#snippet hint()}
			<span><T key="components.page_edit_link.desc" /></span>
		{/snippet}
	</HintedText>
</p>
