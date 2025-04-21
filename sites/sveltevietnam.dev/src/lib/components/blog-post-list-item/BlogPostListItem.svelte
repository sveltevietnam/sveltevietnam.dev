<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import fallback16x9 from '$lib/assets/images/fallbacks/16x9.jpg?enhanced&w=1540;1088;686&imagetools';
	import { SettingsContext } from '$lib/settings/context.svelte';

	type ScreenScopedVar<T extends string> = {
		tablet?: T;
		desktop?: T;
		widescreen?: T;
	};

	export type BlogPostListItemProps = HTMLAttributes<HTMLElement> & {
		post: {
			slug: string;
			title: string;
			description: string;
			authors: { name: string; id: string }[];
			publishedAt: Date;
			series?: { name: string; slug: string }[];
			categories?: { name: string; slug: string }[];
			thumbnail?: Picture | string;
		};
		aspect?: ScreenScopedVar<'square' | 'video'>;
		orientation?: ScreenScopedVar<'portrait' | 'landscape'>;
		titleFont?: ScreenScopedVar<'normal' | 'big'>;
	};
</script>

<script lang="ts">
	let {
		post,
		aspect,
		orientation,
		titleFont,
		class: cls,
		...rest
	}: BlogPostListItemProps = $props();

	const settings = SettingsContext.get();

	let dateFormatter = $derived(
		new Intl.DateTimeFormat(settings.language, {
			year: 'numeric',
			month: 'long',
		}),
	);

	const img = $derived(post.thumbnail ?? fallback16x9);
	const href = $derived(p['/:lang/blog/:slug']({ lang: settings.language, slug: post.slug }));
</script>

<article
	class={[
		'flex flex-col gap-6',
		orientation?.tablet === 'landscape' && 'tablet:flex-row',
		orientation?.desktop === 'landscape' && 'desktop:flex-row',
		orientation?.desktop === 'portrait' && 'desktop:flex-col',
		orientation?.widescreen === 'landscape' && 'widescreen:flex-row',
		orientation?.widescreen === 'portrait' && 'widescreen:flex-col',
		cls,
	]}
	{...rest}
>
	<a class="c-link-image shrink-0" {href}>
		<span class="sr-only"><T message={m.view_more} /></span>
		<enhanced:img
			class={[
				'aspect-video max-w-full',
				aspect?.tablet === 'square' && 'tablet:aspect-square',
				aspect?.desktop === 'square' && 'desktop:aspect-square',
				aspect?.desktop === 'video' && 'desktop:aspect-video',
				aspect?.widescreen === 'square' && 'widescreen:aspect-square',
				aspect?.widescreen === 'video' && 'widescreen:aspect-video',
				orientation?.tablet === 'landscape' && 'tablet:max-w-52',
				orientation?.widescreen === 'portrait' && 'widescreen:max-w-full',
				orientation?.widescreen === 'landscape' && 'widescreen:max-w-52',
			]}
			src={img}
			alt=""
			fetchpriority="low"
			loading="lazy"
			decoding="async"
		/>
	</a>
	<div class="space-y-4">
		<div class="space-y-1">
			{#if post.series?.length}
				<p class="c-text-body-sm text-secondary-on-surface">
					—
					{#each post.series as { name, slug }, i (slug)}
						<a
							class="c-link-lazy hover:text-link"
							href={p['/:lang/blog/series/:slug']({ lang: settings.language, slug })}
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
					titleFont?.desktop === 'big' && 'desktop:text-2xl',
					titleFont?.desktop === 'normal' && 'desktop:text-xl',
					titleFont?.widescreen === 'big' && 'widescreen:text-2xl',
					titleFont?.widescreen === 'normal' && 'widescreen:text-xl',
				]}
			>
				<a class="c-link-preserved relative" {href}>
					{post.title}
					<i
						class="not-can-hover:hidden i i-[ph--cursor-click] text-[0.75em]"
					></i>
				</a>
			</p>
		</div>
		<div class="c-text-body-sm flex items-center gap-2">
			<p class="">
				{#each post.authors as { name, id }, i (id)}
					<a
						class="c-link-lazy font-medium"
						href={p['/:lang/people/:id']({ lang: settings.language, id })}
					>
						{name}
					</a>{i < post.authors.length - 1 ? ', ' : ''}
				{/each}
			</p>
			<p class="text-on-surface-subtle">•</p>
			<p class="capitalize">{dateFormatter.format(post.publishedAt)}</p>
		</div>
		<p>{post.description}</p>
		{#if post.categories?.length}
			<ul class="flex flex-wrap gap-2">
				{#each post.categories as { name, slug } (slug)}
					<li>
						<a
							class="c-link-lazy c-text-body-sm text-on-surface-subtle hover:text-link
							hover:border-link border-outline rounded-full border px-3 py-1 leading-tight"
							href={p['/:lang/blog/categories/:slug']({ lang: settings.language, slug })}
						>
							{name}
						</a>
					</li>
				{/each}
			</ul>
		{/if}
	</div>
</article>
