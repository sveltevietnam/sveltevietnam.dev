<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import { SubscribeForm } from '$lib/domains/subscriber/subscribe';

	let { class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<div
	class={[
		'_container',
		'bg-surface border-onehalf shadow-brutal-lg tablet:grid-cols-2 grid grid-cols-1 gap-6 border-current p-6',
		'tablet:p-8 tablet:gap-8',
		'desktop:p-10 desktop:gap-10',
		cls,
	]}
	{...rest}
>
	<div class="space-y-6">
		<p class="c-text-heading-md">
			<span class="_heading">
				<T key="components.blog_newsletter.heading" />
			</span>
		</p>
		<p><T key="components.blog_newsletter.desc" /></p>
		<svg class="text-surface-variant desktop:h-31.25 h-22.5 w-auto max-w-full" inline-src="blocks">
		</svg>
	</div>

	<SubscribeForm channels={['blog']} />
</div>

<style lang="postcss">
	:global(:is(h2, h3, h4):target) ~ ._container ._heading {
		color: var(--color-info-on-surface);
		background-color: var(--color-info-surface);
	}
</style>
