<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import fallback16x9 from '@sveltevietnam/kit/assets/images/fallbacks/16x9.jpg?enhanced&w=1200;600&imagetools';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

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
	<article class="relative flex flex-col items-start gap-6 @xl:flex-row @xl:gap-10">
		<p
			class="text-secondary-on-surface bg-secondary-surface c-text-body-xs borer-l absolute
			top-0
			left-0 z-2 border px-2 py-0.5"
		>
			{type}
		</p>
		<div class="relative z-1">
			<a class="c-link-image peer relative z-1 block border" {href}>
				<span class="sr-only"><T key="view_more" /></span>
				<enhanced:img
					class="relative aspect-video h-auto shrink-0 @xl:max-w-75"
					src={image}
					fetchpriority="low"
					loading="lazy"
					decoding="async"
					alt=""
					sizes="(min-width: 38rem) 37.5rem, (min-width: 25rem) 75rem, 36.5rem"
				/>
			</a>
			<div class={[backdropClasses, 'bg-sand-500 translate-2 peer-hover:rotate-4']}></div>
			<div class={[backdropClasses, 'bg-sand-600 translate-1 peer-hover:rotate-2']}></div>
		</div>
		<div class="max-w-readable-tight flex-1 space-y-4">
			<h2 class="font-lora text-xl leading-normal font-bold @xl:text-2xl">
				<a class="c-link-preserved relative" {href}>
					{name}
					<i class="not-can-hover:hidden i i-[ph--cursor-click] text-[0.75em]"></i>
				</a>
			</h2>
			<p>{description}</p>
		</div>
	</article>
</div>
