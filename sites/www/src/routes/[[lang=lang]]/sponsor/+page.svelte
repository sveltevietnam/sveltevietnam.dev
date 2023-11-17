<script lang="ts">
	import { onMount } from 'svelte';

	import { gsap } from '$3rd/gsap';
	import { intersect } from '$client/actions/intersect';
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { EMAILS, SOCIAL_LINKS } from '$shared/constants';
	import { BLOG_PATH, EVENTS_PATH } from '$shared/services/navigation/index.js';

	export let data;

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

<main class="c-container-design">
	<div class="mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>
	<section
		class="mb-[80px] tb:mb-[120px] tb:flex tb:flex-row tb:justify-between"
		use:intersect
		bind:this={headerSectionElement}
	>
		<div class="mt-8 tb:mt-[100px]">
			<h1 class="tp-h1 uppercase">{t.title}</h1>
			<p class="tp-h4 mt-6 tb:mt-8">{t.subtitle}</p>
		</div>
		<div class="sp:mt-8 tb:mt-10">
			<svg
				inline-src="./_page/images/key-visuals.svg"
				class="key-visuals h-auto w-full max-w-[583px]"
			/>
		</div>
	</section>
	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<section class="space-y-6">
			<h2 class="tp-h2" use:intersect id="how">
				{t.how.title}
			</h2>
			<div use:intersect>
				<p>{@html t.how.description}</p>
				<ul class="divider-border mt-3 max-w-[548px] divide-y font-medium">
					<li>
						<a href={SOCIAL_LINKS.OPEN_COLLECTIVE} class="c-link-box" external>
							<span>{t.how.ctas.sponsor}</span>
							<svg inline-src="icon/external-link" />
						</a>
					</li>
					<li>
						<a href={SOCIAL_LINKS.DISCORD} class="c-link-box" external>
							<span>{t.how.ctas.discord}</span>
							<svg inline-src="icon/external-link" />
						</a>
					</li>
					<li>
						<a href="mailto:{EMAILS.SPONSOR}" class="c-link-box" external>
							<span>{@html t.how.ctas.email}</span>
							<svg inline-src="icon/external-link" />
						</a>
					</li>
				</ul>
			</div>
			<div use:intersect>
				<p>{t.how.contribute}</p>
				<ul class="divider-border mt-3 max-w-[548px] divide-y font-medium">
					<li>
						<a href={EVENTS_PATH} class="c-link-box">
							<span>{t.how.ctas.events}</span>
						</a>
					</li>
					<li>
						<a href={BLOG_PATH} class="c-link-box">
							<span>{t.how.ctas.blog}</span>
						</a>
					</li>
					<li>
						<a href={SOCIAL_LINKS.GITHUB} class="c-link-box" external>
							<span>{t.how.ctas.github}</span>
							<svg inline-src="icon/external-link" />
						</a>
					</li>
				</ul>
			</div>
		</section>
		<section class="space-y-6" use:intersect>
			<h2 class="tp-h2" id="why">
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
		<section class="space-y-6" use:intersect>
			<h2 class="tp-h2" id="benefits">
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
</style>
