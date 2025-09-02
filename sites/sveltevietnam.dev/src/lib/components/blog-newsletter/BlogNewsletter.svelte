<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { SubscriberUpsertForm, type SubscriberUpsertFormProps } from '$lib/forms/subscriber';

	const { routing } = Contexts.get();

	let {
		class: cls,
		data,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		data: SubscriberUpsertFormProps['data'];
	} = $props();
</script>

<div
	class={[
		'bg-surface border-onehalf shadow-brutal-lg tablet:grid-cols-2 grid grid-cols-1 gap-6 border-current p-6',
		'tablet:p-8 tablet:gap-8',
		'desktop:p-10 desktop:gap-10',
		cls,
	]}
	{...rest}
>
	<div class="space-y-6">
		<p class="c-text-heading-md"><T message={m['components.blog_newsletter.heading']} /></p>
		<p><T message={m['components.blog_newsletter.desc']} /></p>
		<svg class="text-surface-variant h-22.5 desktop:h-31.25 w-auto max-w-full" inline-src="blocks">
		</svg>
	</div>

	<SubscriberUpsertForm {data} action="/{routing.lang}/blog?/subscribe" />
</div>
