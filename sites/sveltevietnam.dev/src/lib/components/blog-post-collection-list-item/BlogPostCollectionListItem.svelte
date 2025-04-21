<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import * as m from '$data/locales/generated/messages';
	import fallback16x9 from '$lib/assets/images/fallbacks/16x9.jpg?enhanced&w=1200;600&imagetools';

	let {
		name,
		description,
		thumbnail,
		class: cls,
		type,
		href,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		name: string;
		description: string;
		href: string;
		type: 'series' | 'category';
		thumbnail?: Picture;
	} = $props();

	let image = $derived(thumbnail || fallback16x9);
	const backdropClasses =
		'origin-bottom-left absolute inset-0 -z-0 transition-transform duration-400 peer-hover:duration-100';
</script>

<div class={['@container', cls]} {...rest}>
	<article class="@xl:flex-row @xl:gap-10 relative flex flex-col items-start gap-6">
		<p
			class="text-secondary-on-surface bg-secondary-surface z-2 c-text-body-xs borer-l
			absolute
			left-0 top-0 border px-2 py-0.5"
		>
			{type}
		</p>
		<div class="z-1 relative">
			<a class="c-link-image z-1 peer relative block border" {href}>
				<span class="sr-only"><T message={m.view_more} /></span>
				<enhanced:img
					class="@xl:max-w-75 relative aspect-video h-auto shrink-0"
					src={image}
					fetchpriority="low"
					loading="lazy"
					decoding="async"
					alt=""
					sizes="(min-width: 38rem) 37.5rem, (min-width: 25rem) 75rem, 36.5rem"
				/>
			</a>
			<div class={[backdropClasses, 'peer-hover:rotate-4 translate-2 bg-sand-500']}></div>
			<div class={[backdropClasses, 'translate-1 bg-sand-600 peer-hover:rotate-2']}></div>
		</div>
		<div class="max-w-readable-tight flex-1 space-y-4">
			<h2 class="font-lora @xl:text-2xl text-xl font-bold leading-normal">
				<a class="c-link-preserved relative" {href}>
					{name}
					<i class="not-can-hover:hidden i i-[ph--cursor-click] text-[0.75em]"></i>
				</a>
			</h2>
			<p>{description}</p>
		</div>
	</article>
</div>
