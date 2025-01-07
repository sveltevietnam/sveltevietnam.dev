<script module lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	type ScreenScopedVar<T extends string> = {
		tablet?: T;
		widescreen?: T;
	};

	export type BlogPostListItemProps = HTMLAttributes<HTMLElement> & {
		post: {
			slug: string;
			title: string;
			description: string;
			enhancedImgSrc?: Picture;
			author: string;
			publishedAt: Date;
			series?: { name: string; slug: string }[];
			categories?: { name: string; slug: string }[];
		};
		aspect?: ScreenScopedVar<'square' | 'video'>;
		orientation?: ScreenScopedVar<'portrait' | 'landscape'>;
		titleFont?: ScreenScopedVar<'normal' | 'big'>;
	};
</script>

<script lang="ts">
	import fallback16x9 from '$lib/assets/images/fallbacks/16x9.jpg?enhanced&w=1540;1088;686&imagetools';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { post, aspect, orientation, titleFont, ...rest }: BlogPostListItemProps = $props();

	const settings = SettingsContext.get();
	const routing = RoutingContext.get();

	let dateFormatter = $derived(
		new Intl.DateTimeFormat(settings.language, {
			year: 'numeric',
			month: 'long',
		}),
	);

	const img = $derived(post.enhancedImgSrc ?? fallback16x9);
</script>

<article
	class={[
		'flex flex-col gap-6',
		orientation?.tablet === 'landscape' && 'tablet:flex-row',
		orientation?.widescreen === 'landscape' && 'widescreen:flex-row',
		orientation?.widescreen === 'portrait' && 'widescreen:flex-col',
	]}
	{...rest}
>
	<a class="c-link-image shrink-0" href={routing.path('blog/:slug', post.slug)}>
		<span class="sr-only">Read post</span>
		<enhanced:img
			class={[
				'aspect-video max-w-full',
				aspect?.tablet === 'square' && [
					'tablet:aspect-square',
					orientation?.tablet === 'landscape' && 'tablet:max-w-52',
				],
				aspect?.widescreen === 'square' && [
					'widescreen:aspect-square',
					orientation?.widescreen === 'portrait' && 'widescreen:max-w-full',
				],
				aspect?.widescreen === 'video' && [
					'widescreen:aspect-video',
					orientation?.widescreen === 'portrait' && 'widescreen:max-w-full',
				],
			]}
			src={img}
			alt=""
			fetchpriority="low"
			loading="lazy"
		/>
	</a>
	<div class="space-y-4">
		<div class="space-y-1">
			{#if post.series?.length}
				<p class="c-text-body-sm text-secondary-on-surface">
					—
					{#each post.series as { name, slug }, i}
						<a
							class="c-link-lazy hover:text-link"
							href={routing.path('blog/series/:series', slug)}
						>
							{name}
						</a>{i < post.series.length - 1 ? ', ' : ''}
					{/each}
				</p>
			{/if}
			<p
				class={[
					'text-xl font-bold',
					titleFont?.tablet === 'big' && 'tablet:text-2xl',
					titleFont?.widescreen === 'big' && 'widescreen:text-2xl',
					titleFont?.widescreen === 'normal' && 'widescreen:text-xl',
				]}
			>
				<a class="c-link-preserved" href={routing.path('blog/:slug', post.slug)}>
					{post.title}
					<i class="i i-[cursor-click]"></i>
				</a>
			</p>
		</div>
		<div class="c-text-body-sm flex items-center gap-2">
			<p class="">{post.author}</p>
			<p class="text-on-surface-subtle">•</p>
			<p class="capitalize">{dateFormatter.format(post.publishedAt)}</p>
		</div>
		<p>{post.description}</p>
		{#if post.categories?.length}
			<ul class="flex flex-wrap gap-2">
				{#each post.categories as { name, slug }}
					<li>
						<a
							class="c-link-lazy c-text-body-sm text-on-surface-subtle hover:text-link
							hover:border-link border-outline rounded-full border px-3 py-1 leading-tight"
							href={routing.path('blog/categories/:category', slug)}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</article>
