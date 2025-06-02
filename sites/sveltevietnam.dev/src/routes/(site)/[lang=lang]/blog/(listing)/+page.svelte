<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { onScroll, createTimeline, stagger } from 'animejs';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { BlogNewsletter } from '$lib/components/blog-newsletter';
	import { BlogPostShowcase } from '$lib/components/blog-post-showcase';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { TextArrowLink } from '$lib/components/text-arrow-link';
	import * as pagefind from '$lib/pagefind/attributes';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { data } = $props();

	const settings = SettingsContext.get();
	const routing = RoutingContext.get();

	const commonArrowLinkClasses = 'group-hover:translate-x-1 transition-transform';

	let elPencilCurtain: HTMLDivElement;
	let elWrite: HTMLDivElement;

	$effect(() => {
		if (settings.screen === 'mobile') return;
		const timeline = createTimeline({
			autoplay: onScroll({
				target: elWrite,
				enter: { target: '90%', container: '100%' },
				leave:
					settings.screen === 'desktop'
						? { target: '50%', container: '50%' }
						: { target: 'top', container: '10%' },
				sync: 0.75,
				repeat: true,
			}),
		})
			.add(elPencilCurtain, {
				scaleY: [1, 0],
			})
			.add(
				Array.from(document.querySelectorAll('._tip')),
				{
					translateY: [10, 0],
					opacity: [0, 1],
				},
				stagger(200, { start: '<<*=.2' }),
			)
			.add(
				Array.from(document.querySelectorAll('._body')),
				{
					opacity: [0, 1],
					scaleX: [0, 1],
				},
				stagger(200, { start: '<<*=.5' }),
			)
			.init();

		return () => timeline.revert();
	});
</script>

{#snippet listingHeader({
	id,
	category,
	href,
	description,
}: {
	id: string;
	category: string;
	href: string;
	description?: string;
})}
	<div class="space-y-4 border-t-4 border-current pt-2">
		<div class="flex items-center justify-between">
			<h2 class="c-text-title uppercase" {id}>{category}</h2>
			<TextArrowLink {href}>
				<T message={m.view_more} />
			</TextArrowLink>
		</div>
		{#if description}
			<p class="max-w-readable-relaxed">{description}</p>
		{/if}
	</div>
{/snippet}

<main {...pagefind.page({ group: 'blog', importance: 'listing' })}>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div class="max-w-pad space-y-10">
			<Breadcrumbs crumbs={routing.breadcrumbs} />
			<div class="space-y-4 text-center">
				<h1 class="c-text-heading-page text-primary-on-surface">
					<T message={m['pages.blog.heading']} />
				</h1>
				<p class="c-text-subtitle-page"><T message={m['pages.blog.tagline']} /></p>
			</div>
		</div>
		<IntroSeparator variant="pen" />
	</section>

	<!-- latest -->
	<section class="max-w-pad py-section tablet:space-y-8 space-y-6" data-pagefind-ignore>
		{@render listingHeader({
			id: 'latest',
			category: m['latest'](settings.language),
			href: p['/:lang/blog/latest']({ lang: settings.language }),
		})}
		<BlogPostShowcase posts={data.posts.latest}></BlogPostShowcase>
	</section>

	<!-- write -->
	<GradientBackground pattern="jigsaw">
		<section class="max-w-pad pt-section pb-section-more">
			<div
				class="tablet:gap-8 tablet:p-8 desktop:gap-10 desktop:p-10 shadow-brutal-lg bg-surface
				max-w-readable-relaxed mx-auto flex items-stretch gap-4 border-2 border-current p-4"
				bind:this={elWrite}
			>
				<div class="text-primary relative flex flex-col gap-4">
					<div
						class="mobile:opacity-0 bg-surface absolute inset-0 origin-top"
						bind:this={elPencilCurtain}
					></div>
					<svg
						class="h-14 w-10"
						width="40"
						height="56"
						viewBox="0 0 40 56"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<path
							d="M17.9 6l.4.2-1.4 4-.5-.2L15 14l.5.2-1.5 4-.4-.2-1.5 4 .5.2-1.4 4-.5-.2-1.4 4 .5.2-1.5 4-.4-.2-1.5 4 .5.2-1.4 4L5 42 3.6 46l.4.2-1.4 4-.5-.2L.7 54l.5.2-.5 1.3H2V56H6v-.5h4V56h4v-.5h4V56h4v-.5h4V56h4v-.5h4V56h4v-.5h1.3l-.5-1.3.5-.2-1.4-4-.5.2-1.4-4 .4-.2L35 42l-.5.2-1.4-4 .5-.2-1.5-4-.4.2-1.5-4 .5-.2-1.4-4-.5.2-1.4-4 .5-.2-1.5-4-.4.2-1.5-4L25 14l-1.4-4-.5.2-1.4-4 .4-.2-1.4-4-.5.2-.2-.7-.2.7-.5-.2-1.4 4Z"
							stroke="currentcolor"
							stroke-dasharray="4 4"
						/>
					</svg>
					<div class="border-primary border-onehalf w-10 flex-1 border-dashed"></div>
					<div class="bg-primary h-10 w-10"></div>
				</div>
				<div class="flex-1 space-y-6">
					<div class="tablet:justify-between tablet:items-end mobile:flex-col flex flex-1 gap-6">
						<h2 class="c-text-heading-md" id="write"><T message={m['pages.blog.write.heading']} /></h2>
						<div class="flex items-end gap-4">
							{#each ['h-8', 'h-14', 'h-6', 'h-7'] as cls (cls)}
								<svg
									class={['_tip text-surface-variant w-auto', cls]}
									width="40"
									height="56"
									viewBox="0 0 40 56"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path d="M20 0 40 56H0L20 0Z" fill="currentcolor" />
								</svg>
							{/each}
						</div>
					</div>
					<p><T message={m['pages.blog.write.desc']} /></p>
					<a
						class="c-btn c-btn--pop w-fit text-left"
						href={p['/:lang/blog/write']({ lang: settings.language })}
					>
						<i class="i i-[ph--pencil-simple] h-6 w-6"></i>
						<span><T message={m['pages.blog.write.cta']} /></span>
					</a>
					<p><T message={m['pages.blog.write.discuss']} /></p>
					<div class="tablet:gap-8 desktop:gap-10 flex items-end gap-4">
						<div class="_body bg-surface-variant h-6 flex-1 origin-left"></div>
						<div class="_body bg-surface-variant h-8 w-8 origin-left"></div>
						<div class="_body bg-surface-variant h-10 flex-1 origin-left"></div>
					</div>
				</div>
			</div>
		</section>
	</GradientBackground>

	{#if data.series.peopleOfSvelte && data.posts.peopleOfSvelte.length}
		<!-- people-of-svelte -->
		<section
			class="max-w-pad py-section tablet:space-y-8 space-y-6"
			data-pagefind-ignore
		>
			{@render listingHeader({
				id: 'people-of-svelte',
				category: data.series.peopleOfSvelte.name,
				href: p['/:lang/blog/series/:slug']({
					lang: settings.language,
					slug: data.series.peopleOfSvelte.slug,
				}),
				description: data.series.peopleOfSvelte.description,
			})}
			<BlogPostShowcase posts={data.posts.peopleOfSvelte}></BlogPostShowcase>
		</section>
	{/if}

	{#if data.categories.svelteAndKit && data.posts.svelteAndKit.length}
		<!-- svelte-and-kit -->
		<section
			class="max-w-pad py-section tablet:space-y-8 space-y-6"
			data-pagefind-ignore
		>
			{@render listingHeader({
				id: 'svelte-and-kit',
				category: data.categories.svelteAndKit.name,
				href: p['/:lang/blog/categories/:slug']({
					lang: settings.language,
					slug: data.categories.svelteAndKit.slug,
				}),
				description: data.categories.svelteAndKit.description,
			})}
			<BlogPostShowcase posts={data.posts.svelteAndKit}></BlogPostShowcase>
		</section>
	{/if}

	<!-- resources -->
	<GradientBackground pattern="circuit" color="secondary">
		<section class="max-w-pad py-section-more">
			<div
				class="shadow-brutal bg-surface flex items-start justify-between border-2 border-current"
			>
				<p class="p-4 pl-6 leading-relaxed"><T message={m['pages.blog.resources.desc']} /></p>
				<a
					class="tablet:self-stretch desktop:p-4 bg-secondary mobile:shadow-brutal shadow-on-surface group grid
					place-items-center p-8 text-white"
					href="{p['/:lang']({ lang: settings.language })}#resources"
				>
					<span class="sr-only"><T message={m['pages.blog.resources.view']} /></span>
					<i class="i i-[ph--arrow-right] h-6 w-6 {commonArrowLinkClasses}"></i>
				</a>
			</div>
		</section>
	</GradientBackground>

	{#if data.categories.insider && data.posts.insider.length}
		<!-- insider -->
		<section
			class="max-w-pad py-section tablet:space-y-8 space-y-6"
			data-pagefind-ignore
		>
			{@render listingHeader({
				id: 'insider',
				category: data.categories.insider.name,
				href: p['/:lang/blog/categories/:slug']({
					lang: settings.language,
					slug: data.categories.insider.slug,
				}),
				description: data.categories.insider.description,
			})}
			<BlogPostShowcase posts={data.posts.insider} flat></BlogPostShowcase>
		</section>
	{/if}

	<!-- newsletter  -->
	<GradientBackground>
		<section class="max-w-pad pt-section pb-section-more" data-pagefind-ignore>
			<h2 class="sr-only" id="newsletter">
				<T message={m.newsletter} />
			</h2>
			<BlogNewsletter data={data.subscribeFormData} />
		</section>
	</GradientBackground>
</main>
