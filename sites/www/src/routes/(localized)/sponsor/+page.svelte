<script lang="ts">
	import { onMount } from 'svelte';

	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { gsap } from '$lib/3rd/gsap';
	import { intersect } from '$lib/actions/intersect';
	import { EMAILS, SOCIAL_LINKS } from '$shared/constants';

	export let data;

	const { routes } = getNavigationContext();

	$: t = data.translations.page;

	let ctx: gsap.Context;
	let headerSectionElement: HTMLElement;
	let parallaxTimeline: gsap.core.Timeline;
	$: if (headerSectionElement) {
		ctx = gsap.context(() => {
			parallaxTimeline = gsap.timeline({
				scrollTrigger: {
					invalidateOnRefresh: true,
					trigger: headerSectionElement,
					start: 0,
					end: 'bottom top',
					scrub: 2,
				},
			});
			parallaxTimeline.fromTo(
				':is(.cube, .hand)',
				{
					x: 0,
					y: 0,
					rotate: 0,
				},
				{
					x: (_, target: Element) => gsap.getProperty(target, '--parallax-x').toString(),
					y: (_, target: Element) => gsap.getProperty(target, '--parallax-y').toString(),
					rotate: (_, target: Element) => gsap.getProperty(target, '--parallax-rotate').toString(),
				},
				0,
			);
		}, headerSectionElement);
	}

	onMount(() => {
		return () => {
			ctx?.revert();
		};
	});
</script>

<main>
	<div class="max-w-pad mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>
	<section
		class="max-w-pad mb-[80px] tb:mb-[120px] tb:flex tb:flex-row tb:justify-between"
		use:intersect
		bind:this={headerSectionElement}
	>
		<div class="mt-8 tb:mt-[100px]">
			<h1 class="c-text-h1 uppercase">{t.title}</h1>
			<p class="c-text-h4 mt-6 tb:mt-8">{t.subtitle}</p>
		</div>
		<div class="sp:mt-8 tb:mt-10">
			<svg
				inline-src="./_page/images/key-visuals.svg"
				class="key-visuals h-auto w-full max-w-[583px]"
			/>
		</div>
	</section>
	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<section class="gradient-wrapper max-w-pad space-y-6">
			<h2 class="c-text-h2" use:intersect id="how">
				{t.how.title}
			</h2>
			<div use:intersect>
				<p>{@html t.how.description}</p>
				<ul class="divider-border mt-3 max-w-[548px] divide-y font-medium">
					<li>
						<a href={SOCIAL_LINKS.OPEN_COLLECTIVE} class="c-link c-link--box" external>
							<span>{t.how.ctas.sponsor}</span>
						</a>
					</li>
					<li>
						<a href={SOCIAL_LINKS.DISCORD} class="c-link c-link--box" external>
							<span>{t.how.ctas.discord}</span>
						</a>
					</li>
					<li>
						<a href="mailto:{EMAILS.SPONSOR}" class="c-link c-link--box" external>
							<span>{@html t.how.ctas.email}</span>
						</a>
					</li>
				</ul>
			</div>
			<div use:intersect>
				<p>{t.how.contribute}</p>
				<ul class="divider-border mt-3 max-w-[548px] divide-y font-medium">
					<li>
						<a href={$routes.events.path} class="c-link c-link--box">
							<span>{t.how.ctas.events}</span>
						</a>
					</li>
					<li>
						<a href={$routes.blog.path} class="c-link c-link--box">
							<span>{t.how.ctas.blog}</span>
						</a>
					</li>
					<li>
						<a href={SOCIAL_LINKS.GITHUB} class="c-link c-link--box" external>
							<span>{t.how.ctas.github}</span>
						</a>
					</li>
				</ul>
			</div>
		</section>
		<section class="max-w-pad space-y-6" use:intersect>
			<h2 class="c-text-h2" id="why">
				{t.why.title}
			</h2>
			<p>{@html t.why.description}</p>
			<div>
				<p>{t.why.for.description}</p>
				<ul class="mt-3 list-inside list-disc space-y-3">
					<li class="list-item">{@html t.why.for.bullets.maintain}</li>
					<li class="list-item">{@html t.why.for.bullets.create}</li>
				</ul>
			</div>
			<p>{@html t.why.inspect}</p>
		</section>
		<section class="max-w-pad space-y-6" use:intersect>
			<h2 class="c-text-h2" id="benefits">
				{t.benefits.title}
			</h2>
			<p>{t.benefits.description}</p>
		</section>
	</div>
</main>

<style lang="postcss">
	.key-visuals {
		overflow: visible;

		& :global(.spark) {
			@light global {
				fill: #212121;
			}
		}

		& .cube {
			--parallax-x: 0;
			--parallax-y: 0;
			--parallax-rotate: 0;

			&.cube--small {
				--parallax-x: -30px;
				--parallax-y: -100px;
			}

			&.cube--medium {
				--parallax-x: 0px;
				--parallax-y: -40px;
			}

			&.cube--large {
				--parallax-x: 20px;
				--parallax-y: -80px;
			}
		}

		& .hand {
			--parallax-x: 0;
			--parallax-y: 0;
			--parallax-rotate: 0;

			&.hand--left {
				--parallax-x: 0;
				--parallax-y: 80px;
				--parallax-rotate: 4deg;
			}

			&.hand--right {
				--parallax-x: 0;
				--parallax-y: -40px;
				--parallax-rotate: -2deg;
			}
		}
	}

	.gradient-wrapper {
		--gradient-height: 200px;
		--gradient-offset: 80px;

		position: relative;

		&::before {
			pointer-events: none;
			content: '';

			position: absolute;
			z-index: -1;
			top: calc(var(--gradient-offset) - var(--gradient-height));
			right: 0;
			bottom: calc(var(--gradient-offset) - var(--gradient-height));
			left: 0;

			background: linear-gradient(
				to bottom,
				transparent,
				theme('colors.neutral.DEFAULT') var(--gradient-offset),
				theme('colors.neutral.DEFAULT') calc(100% - var(--gradient-offset)),
				transparent
			);
		}

		@screen tb {
			--gradient-height: 360px;
			--gradient-offset: 150px;
		}
	}
</style>
