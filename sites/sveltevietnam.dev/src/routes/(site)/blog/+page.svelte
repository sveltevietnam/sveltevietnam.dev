<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message } from '@sveltevietnam/i18n/runtime';

	import { POST } from '$data/mocks';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostListItem } from '$lib/components/blog-post-list-item';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { RoutingContext } from '$lib/routing/context.svelte';

	let { data } = $props();

	const routing = RoutingContext.get();

	let locales = $derived(data.locales.page as import('./_page/locales/generated').Locale);

	const commonArrowLinkClasses = 'group-hover:translate-x-1 transition-transform';
</script>

{#snippet listingHeader({
	category,
	href,
	description,
}: {
	category: string;
	href: string;
	description?: Message<never>;
})}
	<div class="space-y-4 border-t-4 border-current pt-2">
		<div class="flex items-center justify-between">
			<h2 class="c-text-title uppercase">{category}</h2>
			<a class="c-link-lazy group" {href}>
				<T message={locales.view_more} />
				<i class="i i-[arrow-right] h-5 w-5 {commonArrowLinkClasses}"></i>
			</a>
		</div>
		{#if description}
			<p class="max-w-[70ch]"><T message={description} /></p>
		{/if}
	</div>
{/snippet}

<main>
	<!-- intro -->
	<section
		class="space-y-section pt-intro-pad-top from-32% from-primary-surface to-surface bg-gradient-to-b"
	>
		<div class="max-w-pad space-y-10">
			<Breadcrumbs crumbs={data.routing.breadcrumbs} />
			<div class="space-y-4 text-center">
				<h1 class="c-text-heading-page text-primary-on-surface">
					<T message={locales.page_heading} />
				</h1>
				<p class="c-text-subtitle-page"><T message={locales.page_tagline} /></p>
			</div>
		</div>
		<div class="flex items-center gap-3">
			<div class="bg-primary h-10 w-10"></div>
			<div class="bg-primary h-10 flex-1"></div>
			<svg
				class="h-10 w-14"
				width="56"
				height="40"
				viewBox="0 0 56 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M56 20L0 40L2.82652e-06 0L56 20Z" fill="var(--color-primary)" />
			</svg>
		</div>
	</section>

	<!-- latest -->
	<section class="max-w-pad py-section tablet:space-y-8 space-y-6" id="latest">
		{@render listingHeader({
			category: locales.latest.toString(),
			href: routing.path('blog/latest')!,
		})}
		<ul class="widescreen:grid-cols-2 grid grid-cols-1 gap-6 widescreen:gap-0">
			<li
				class="widescreen:pb-0 widescreen:border-b-0 widescreen:pr-4 widescreen:border-r widescreen:row-span-2 border-b
				pb-6"
			>
				<BlogPostListItem post={POST} />
			</li>
			<li class="widescreen:pb-4 widescreen:pl-4 widescreen:col-start-2 widescreen:row-start-1 border-b pb-6">
				<BlogPostListItem
					post={POST}
					orientation={{ tablet: 'landscape' }}
					aspect={{ tablet: 'square' }}
				/>
			</li>
			<li class="widescreen:pl-4 widescreen:pt-4 widescreen:col-start-2 widescreen:row-start-2">
				<BlogPostListItem
					post={POST}
					orientation={{ tablet: 'landscape' }}
					aspect={{ tablet: 'square' }}
				/>
			</li>
		</ul>
	</section>

	<!-- write -->
	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more" id="write">
			<div
				class="tablet:gap-8 tablet:p-8 desktop:gap-10 desktop:p-10 shadow-brutal-lg bg-surface mx-auto flex
			max-w-[100ch] items-stretch gap-4 border-2 border-current p-4"
			>
				<div class="text-primary flex flex-col gap-4">
					<svg
						class="h-14 w-10"
						width="40"
						height="56"
						viewBox="0 0 40 56"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.8571 6L19.2857 2L19.7566 2.16817L20 1.48661L20.2434 2.16817L20.7143 2L22.1429 6L21.672 6.16817L23.1006 10.1682L23.5714 10L25 14L24.5291 14.1682L25.9577 18.1682L26.4286 18L27.8571 22L27.3863 22.1682L28.8148 26.1682L29.2857 26L30.7143 30L30.2434 30.1682L31.672 34.1682L32.1429 34L33.5714 38L33.1006 38.1682L34.5291 42.1682L35 42L36.4286 46L35.9577 46.1682L37.3863 50.1682L37.8571 50L39.2857 54L38.8148 54.1682L39.2905 55.5H38V56H34V55.5H30V56H26V55.5H22V56L18 56V55.5H14V56H10V55.5H6L6 56H2V55.5H0.709502L1.18516 54.1682L0.714285 54L2.14286 50L2.61373 50.1682L4.0423 46.1682L3.57143 46L5 42L5.47087 42.1682L6.89944 38.1682L6.42857 38L7.85714 34L8.32801 34.1682L9.75659 30.1682L9.28572 30L10.7143 26L11.1852 26.1682L12.6137 22.1682L12.1429 22L13.5714 18L14.0423 18.1682L15.4709 14.1682L15 14L16.4286 10L16.8994 10.1682L18.328 6.16817L17.8571 6Z"
							stroke="currentcolor"
							stroke-dasharray="4 4"
						/>
					</svg>
					<div class="border-primary border-onehalf w-10 flex-1 border-dashed"></div>
					<div class="bg-primary h-10 w-10"></div>
				</div>
				<div class="flex-1 space-y-6">
					<div class="tablet:justify-between tablet:items-end mobile:flex-col flex flex-1 gap-6">
						<h2 class="c-text-heading-md"><T message={locales.write_heading} /></h2>
						<div class="flex items-end gap-4">
							{#each ['h-8', 'h-14', 'h-6', 'h-7'] as cls}
								<svg
									class={['text-surface-variant w-auto', cls]}
									width="40"
									height="56"
									viewBox="0 0 40 56"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M19.9995 0L39.9995 56L-0.000488281 56L19.9995 0Z" fill="currentcolor" />
								</svg>
							{/each}
						</div>
					</div>
					<p><T message={locales.write_description} /></p>
					<a class="c-btn c-btn--pop w-fit text-left" href="#placeholder">
						<i class="i i-[pencil-simple] h-6 w-6"></i>
						<span><T message={locales.write_cta} /></span>
					</a>
					<p><T message={locales.write_discuss} /></p>
					<div class="tablet:gap-8 desktop:gap-10 flex items-end gap-4">
						<div class="bg-surface-variant h-6 flex-1"></div>
						<div class="bg-surface-variant h-8 w-8"></div>
						<div class="bg-surface-variant h-10 flex-1"></div>
					</div>
				</div>
			</div>
		</section>
	</GradientBackground>

	<!-- technical -->
	<section class="max-w-pad py-section tablet:space-y-8 space-y-6" id="technical">
		{@render listingHeader({
			category: 'Technical',
			href: routing.path('blog/categories/:category', 'technical')!,
			description: locales.category_technical,
		})}
		<ul class="widescreen:grid-cols-[60fr_41fr_39fr] grid grid-cols-1 gap-6 widescreen:gap-0">
			<li
				class="widescreen:pb-0 widescreen:border-b-0 widescreen:pr-4 widescreen:border-r widescreen:row-span-2 border-b
				pb-6"
			>
				<BlogPostListItem post={POST} aspect={{ widescreen: 'square' }} titleFont={{ widescreen: 'big' }} />
			</li>
			<li
				class="widescreen:pb-4 widescreen:px-4 widescreen:col-start-2 widescreen:row-start-1 widescreen:border-r border-b pb-6"
			>
				<BlogPostListItem
					post={POST}
					orientation={{ tablet: 'landscape', widescreen: 'portrait' }}
					aspect={{ tablet: 'square', widescreen: 'video' }}
				/>
			</li>
			<li class="pb-6 widescreen:pb-4 border-b widescreen:pl-4 widescreen:col-start-3 widescreen:row-start-1">
				<BlogPostListItem
					post={POST}
					orientation={{ tablet: 'landscape', widescreen: 'portrait' }}
					aspect={{ tablet: 'square', widescreen: 'video' }}
				/>
			</li>
			<li
				class="widescreen:pl-4 widescreen:pt-4 widescreen:col-start-2 widescreen:row-start-2 widescreen:col-span-2"
			>
				<BlogPostListItem
					post={POST}
					orientation={{ tablet: 'landscape' }}
					aspect={{ tablet: 'square' }}
				/>
			</li>
		</ul>
	</section>

	<!-- resources -->
	<GradientBackground pattern="circuit" color="secondary">
		<section class="max-w-pad py-section-more">
			<div
				class="shadow-brutal bg-surface flex items-start justify-between border-2 border-current"
			>
				<p class="p-4 pl-6 leading-relaxed"><T message={locales.resource} /></p>
				<a
					class="tablet:self-stretch desktop:p-4 bg-secondary mobile:shadow-brutal shadow-on-surface group grid
					place-items-center p-8 text-white"
					href={routing.path('home')}
				>
					<span class="sr-only"><T message={locales.view_resources} /></span>
					<i class="i i-[arrow-right] h-6 w-6 {commonArrowLinkClasses}"></i>
				</a>
			</div>
		</section>
	</GradientBackground>

	<!-- insider -->
	<section class="max-w-pad py-section tablet:space-y-8 space-y-6" id="insider">
		{@render listingHeader({
			category: 'Insider',
			href: routing.path('blog/categories/:category', 'insider')!,
			description: locales.category_insider,
		})}
		<ul class="grid grid-cols-1 desktop:grid-cols-[1fr_auto_1fr_auto_1fr] gap-6 desktop:gap-4">
			<li class="contents">
				<BlogPostListItem post={POST} />
			</li>
			<li class="contents">
				<div class="desktop:w-0.25 w-full h-0.25 bg-outline desktop:h-full"></div>
				<BlogPostListItem post={POST} />
			</li>
			<li class="contents">
				<div class="desktop:w-0.25 w-full h-0.25 bg-outline desktop:h-full"></div>
				<BlogPostListItem post={POST} />
			</li>
		</ul>
	</section>

	<!-- newsletter  -->
	<GradientBackground>
		<section class="max-w-pad pt-section pb-section-more" id="newsletter">
			<BlogNewsletter locale={data.locales.blogNewsletter} />
		</section>
	</GradientBackground>
</main>
