<script lang="ts">
	import { T } from '@sveltevietnam/i18n-new';
	import type { KeySimple } from '@sveltevietnam/i18n-new/generated';
	import { SOCIAL_LINKS } from '@sveltevietnam/kit/constants';
	import { createTimeline, onScroll } from 'animejs';
	import type { Picture } from 'vite-imagetools';

	import { SettingsContext } from '$lib/settings/context.svelte';

	import StepContainer from './components/StepContainer.svelte';
	import svgPuzzle from './images/puzzle.svg';
	import screenshotDocs from './images/screenshot-svelte-docs.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotGithub from './images/screenshot-svelte-github.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotHack from './images/screenshot-svelte-hack.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotLab from './images/screenshot-svelte-lab.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotPlayground from './images/screenshot-svelte-playground.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotSociety from './images/screenshot-svelte-society.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotSummit from './images/screenshot-svelte-summit.jpg?enhanced&w=1400;900;600;300&imagetools';
	import screenshotTutorial from './images/screenshot-svelte-tutorial.jpg?enhanced&w=1400;900;600;300&imagetools';

	const settings = SettingsContext.get();

	let elResources: HTMLElement;
	let elCursor: SVGElement;

	function createCursorTimeline() {
		const clickPointElements = Array.from(elResources.getElementsByClassName('_click-point'));
		const { x, y } = elCursor.getBoundingClientRect();
		const clickPointCoors = [
			{ x, y },
			...clickPointElements.map((el, i) => {
				const { top, left, height, right } = el.getBoundingClientRect();
				if (i % 2 === 0) {
					return { x: left, y: top + height / 2 };
				}
				return { x: right, y: top + height / 2 };
			}),
		];

		const accumulatedDelta: { translateX: number; translateY: number }[] = [
			{
				translateX: 0,
				translateY: 0,
			},
		];
		for (let i = 1; i < clickPointCoors.length; i++) {
			const { x: x1, y: y1 } = clickPointCoors[i - 1];
			const { x: x2, y: y2 } = clickPointCoors[i];
			const { translateX: accumulatedX, translateY: accumulatedY } = accumulatedDelta[i - 1];

			accumulatedDelta.push({
				translateX: accumulatedX + x2 - x1,
				translateY: accumulatedY + y2 - y1,
			});
		}

		const timeline = createTimeline({
			autoplay: onScroll({
				target: elResources,
				enter: { target: '0%', container: '0%' },
				leave: { target: '100%', container: '100%' },
				sync: 0.75,
				repeat: true,
			}),
		});
		for (let i = 1; i < accumulatedDelta.length; i++) {
			const { translateX, translateY } = accumulatedDelta[i];

			// since timeline is scroll-linked (sync)
			// duration here is relative to each other
			// the three click points in between are set
			// to be 2.2 times longer than the other ones
			let duration = 1;
			if (i === 4 || i === 5 || i === 6) {
				duration = 2.2;
			}

			timeline.add(elCursor, {
				opacity: i === accumulatedDelta.length - 1 ? 0 : 1,
				translateX,
				translateY,
				// rotateZ: i % 2 === 0 && i < accumulatedDelta.length - 1  ? '90deg' : '0deg',
				scale: [1, 0.75, 1],
				duration,
			});
		}
		return timeline;
	}

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		settings.screen;
		const timeline = createCursorTimeline();
		return () => timeline.revert();
	});
</script>

{#snippet step(key: KeySimple)}
	<div class="isolate">
		<p
			class="_border-gradient bg-surface c-text-body-xs relative w-fit px-3 py-1.5 leading-tight tracking-widest uppercase"
		>
			<T {key} />
		</p>
	</div>
	<!-- <p -->
	<!-- 	class="c-text-body-xs relative isolate w-fit overflow-hidden px-3.5 py-2 uppercase leading-tight tracking-widest" -->
	<!-- > -->
	<!-- 	<span -->
	<!-- 		class="inset-0.25 from-primary to-secondary p-0.25 absolute z-0 -->
	<!-- 		block bg-gradient-to-br" -->
	<!-- 	></span> -->
	<!-- 	<span class="z-1 relative bg-surface"><T {message} /></span> -->
	<!-- </p> -->
{/snippet}

{#snippet resource({
	description,
	links,
	linksClasses,
	image,
	footnote,
}: {
	description: KeySimple;
	links: { key: KeySimple; href: string; class?: string }[];
	linksClasses?: string;
	image:
		| { key: KeySimple; href: string; src: Picture; class?: string }
		| { src: string; width: number; height: number };
	footnote?: KeySimple;
})}
	<div
		class="tablet:gap-8 desktop:gap-10 mobile:flex-col odd:tablet:flex-row-reverse group flex gap-6"
	>
		<div class="tablet:space-y-6 mobile:contents flex-1">
			<p class="mobile:order-1 drop-cap leading-relaxed">
				<T key={description} />
			</p>
			<div class="mobile:order-3 flex flex-col gap-6 {linksClasses}">
				{#each links as { key, href, class: cls } (href)}
					<a
						class={['c-btn c-btn--pop', cls]}
						{href}
						data-external
						data-umami-event="click-homepage-resource-link"
						data-umami-event-url={href}
					>
						<span><T {key} /></span>
						<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
					</a>
				{/each}
			</div>
			{#if footnote}
				<p class="mobile:order-4">
					<em><T key={footnote} /></em>
				</p>
			{/if}
		</div>
		{#if 'width' in image}
			<div class="tablet:flex-1 mobile:order-2">
				<img
					class="h-auto w-full"
					{...image}
					alt=""
					loading="lazy"
					fetchpriority="low"
					decoding="async"
				/>
			</div>
		{:else}
			<div
				class="from-primary to-tertiary mobile:order-2 tablet:flex-1 h-fit
				bg-gradient-to-r p-0.5 group-odd:bg-gradient-to-l"
			>
				<a
					class={['c-link-image block', image.class]}
					href={image.href}
					data-external
					data-umami-event="click-homepage-resource-link"
					data-umami-event-url={image.href}
					aria-hidden="true"
					tabindex="-1"
				>
					<span class="sr-only"><T key={image.key} /></span>
					<enhanced:img
						src={image.src}
						alt=""
						loading="lazy"
						fetchpriority="low"
						decoding="async"
						sizes="(min-width: 48rem) 28.125rem, (min-width: 25rem) 43.75rem, 18.75rem"
					/>
				</a>
			</div>
		{/if}
	</div>
{/snippet}

<section
	class="max-w-pad pb-section pt-section-more space-y-section-more relative"
	bind:this={elResources}
>
	<h2 class="c-text-heading-lg text-center" id="resources">
		<T key="pages.home.resources.heading" />
	</h2>
	<svg
		class="_cursor z-popup absolute top-0 left-1/2 m-auto block h-10 w-10 origin-top-left
		opacity-0 drop-shadow transform-3d"
		xmlns="http://www.w3.org/2000/svg"
		width="40"
		height="40"
		fill="none"
		bind:this={elCursor}
	>
		<path
			fill="#FFA000"
			d="M37.648 13.876 3.66 1.25A1.886 1.886 0 0 0 1.25 3.66l12.626 33.988a1.88 1.88 0 0 0 3.548-.093l4.659-14.925a.832.832 0 0 1 .547-.547l14.924-4.659a1.882 1.882 0 0 0 .094-3.548Z"
		/>
		<path
			fill="#000"
			d="M37.648 13.876 3.66 1.25A1.886 1.886 0 0 0 1.25 3.66l12.626 33.988a1.88 1.88 0 0 0 3.548-.093l4.659-14.925a.832.832 0 0 1 .547-.547l14.924-4.659a1.882 1.882 0 0 0 .094-3.548Zm-.466 2.355L22.257 20.89a2.086 2.086 0 0 0-1.367 1.367L16.23 37.182a.623.623 0 0 1-1.183.031L2.421 3.225c-.146-.64.274-.922.804-.804l33.988 12.627a.622.622 0 0 1-.03 1.183Z"
		/>
	</svg>

	<StepContainer class="tablet:max-desktop:pb-32">
		<div class="relative flex items-center justify-between gap-4">
			<div class="space-y-4">
				{@render step('pages.home.resources.one.step')}
				<h3 class="c-text-heading-md pr-30" id="step-1">
					<T key="pages.home.resources.one.heading" />
				</h3>
			</div>
			<svg
				class="mobile:absolute mobile:-top-2 mobile:-right-2 h-auto w-25 shrink-0"
				inline-src="./images/box"
			></svg>
		</div>

		{@render resource({
			description: 'pages.home.resources.one.tutorial.desc',
			links: [
				{
					key: 'pages.home.resources.one.tutorial.link',
					href: 'https://svelte.dev/tutorial',
					class: '_click-point',
				},
			],
			linksClasses: 'w-fit',
			image: {
				key: 'pages.home.resources.one.tutorial.link',
				href: 'https://svelte.dev/tutorial',
				src: screenshotTutorial,
			},
			footnote: 'pages.home.resources.one.tutorial.footnote',
		})}

		{@render resource({
			description: 'pages.home.resources.one.playground.desc',
			links: [
				{
					key: 'pages.home.resources.one.playground.link',
					href: 'https://svelte.dev/playground',
					class: '_click-point',
				},
			],
			linksClasses: 'w-fit',
			image: {
				key: 'pages.home.resources.one.playground.link',
				href: 'https://svelte.dev/playground',
				src: screenshotPlayground,
			},
		})}

		{@render resource({
			description: 'pages.home.resources.one.lab.desc',
			links: [
				{
					key: 'pages.home.resources.one.lab.link',
					href: 'https://www.sveltelab.dev/',
					class: '_click-point',
				},
			],
			linksClasses: 'ml-auto w-fit',
			image: {
				key: 'pages.home.resources.one.lab.link',
				href: 'https://www.sveltelab.dev/',
				src: screenshotLab,
			},
		})}

		<svg
			class="tablet:absolute desktop:left-6 desktop:bottom-6 widescreen:left-10 widescreen:bottom-10
				bottom-2 left-2 h-auto w-39.5"
			inline-src="./images/rect-washer"
		></svg>
	</StepContainer>

	<StepContainer>
		<div class="mobile:flex-col relative flex items-center justify-between gap-4">
			<svg class="mobile:self-start h-18 w-auto shrink-0" inline-src="./images/book"></svg>
			<div class="mobile:-mt-10 flex flex-col items-end gap-4">
				{@render step('pages.home.resources.two.step')}
				<h3 class="c-text-heading-md text-right" id="step-2">
					<T key="pages.home.resources.two.heading" />
				</h3>
			</div>
		</div>

		{@render resource({
			description: 'pages.home.resources.two.docs.desc',
			links: [{ key: 'pages.home.resources.two.docs.link', href: 'https://svelte.dev/docs' }],
			linksClasses: 'w-fit',
			image: {
				key: 'pages.home.resources.two.docs.link',
				href: 'https://svelte.dev/docs',
				src: screenshotDocs,
				class: '_click-point',
			},
		})}
	</StepContainer>

	<StepContainer>
		<div class="space-y-4">
			{@render step('pages.home.resources.three.step')}
			<h3 class="c-text-heading-md text-right" id="step-3">
				<T key="pages.home.resources.three.heading" />
			</h3>
		</div>

		{@render resource({
			description: 'pages.home.resources.three.desc',
			links: [
				{
					key: 'pages.home.resources.three.discord',
					href: SOCIAL_LINKS.DISCORD,
					class: '_click-point',
				},
				{ key: 'pages.home.resources.bluesky', href: SOCIAL_LINKS.BLUESKY },
				{ key: 'pages.home.resources.three.github', href: SOCIAL_LINKS.GITHUB },
			],
			image: { src: svgPuzzle, width: 291, height: 159 },
		})}
		<p class="-mt-4"><T key="pages.home.resources.three.note" /></p>
	</StepContainer>

	<StepContainer>
		<div class="flex items-start justify-between gap-4">
			<svg class="h-20 w-20 shrink-0" inline-src="./images/svelte-society-logo"></svg>
			<div class="flex flex-col items-end gap-4">
				{@render step('pages.home.resources.four.step')}
				<h3 class="c-text-heading-md text-right" id="step-4">
					<T key="pages.home.resources.four.heading" />
				</h3>
			</div>
		</div>

		{@render resource({
			description: 'pages.home.resources.four.svelte.desc',
			links: [
				{
					key: 'pages.home.resources.four.svelte.github.svelte',
					href: 'https://github.com/sveltejs/svelte',
				},
				{
					key: 'pages.home.resources.four.svelte.github.sveltekit',
					href: 'https://github.com/sveltejs/kit',
				},
				{
					key: 'pages.home.resources.four.svelte.github.svelte_dev',
					href: 'https://github.com/sveltejs/svelte.dev',
				},
				{
					key: 'pages.home.resources.bluesky',
					href: 'https://bsky.app/profile/svelte.dev',
				},
			],
			image: {
				key: 'pages.home.resources.four.svelte.github.svelte',
				href: 'https://github.com/sveltejs',
				src: screenshotGithub,
				class: '_click-point',
			},
		})}

		{@render resource({
			description: 'pages.home.resources.four.society.desc',
			links: [
				{
					key: 'pages.home.resources.four.society.discord',
					href: 'https://svelte.dev/chat',
				},
				{
					key: 'pages.home.resources.bluesky',
					href: 'https://bsky.app/profile/sveltesociety.dev',
				},
				{
					key: 'pages.home.resources.four.society.website',
					href: 'https://www.sveltesociety.dev/',
				},
			],
			image: {
				key: 'pages.home.resources.four.society.website',
				href: 'https://www.sveltesociety.dev/',
				src: screenshotSociety,
				class: '_click-point',
			},
		})}

		{@render resource({
			description: 'pages.home.resources.four.summit.desc',
			links: [
				{
					key: 'pages.home.resources.four.summit.youtube',
					href: 'https://www.youtube.com/@SvelteSociety',
				},
				{
					key: 'pages.home.resources.four.summit.website',
					href: 'https://www.sveltesummit.com/',
				},
			],
			image: {
				key: 'pages.home.resources.four.summit.website',
				href: 'https://www.sveltesummit.com/',
				src: screenshotSummit,
				class: '_click-point',
			},
		})}

		{@render resource({
			description: 'pages.home.resources.four.hack.desc',
			links: [
				{
					key: 'pages.home.resources.four.hack.link',
					href: 'https://hack.sveltesociety.dev',
				},
			],
			image: {
				key: 'pages.home.resources.four.hack.link',
				href: 'https://hack.sveltesociety.dev',
				src: screenshotHack,
				class: '_click-point',
			},
		})}

		<div class="bg-outline h-px w-full"></div>

		<section class="prose max-w-readable-relaxed leading-relaxed">
			<p><T key="pages.home.resources.four.others" /></p>
			<ul>
				<li><T key="pages.home.resources.four.newsletter" /></li>
				<li><T key="pages.home.resources.four.madebysvelte" /></li>
				<li class="_click-point"><T key="pages.home.resources.four.jobs" /></li>
			</ul>
		</section>
	</StepContainer>
</section>

<style>
	._cursor {
		will-change: transform, opacity;
	}

	.drop-cap::first-letter {
		margin-right: 0.5rem;

		font-family: var(--font-lora);
		line-height: 1;
		color: var(--color-svelte);

		initial-letter: 3 2;
	}

	@supports not (initial-letter: 1 1) {
		.drop-cap::first-letter {
			float: left;
			font-size: 2.5lh;
		}
	}

	@property --border-gradient-angle {
		inherits: false;
		initial-value: 0deg;
		syntax: '<angle>';
	}

	._border-gradient {
		--border-gradient-angle: 0deg;

		&::after,
		&::before {
			content: '';

			position: absolute;
			z-index: -1;
			inset: calc(-0.25 * var(--spacing));

			background: conic-gradient(
				from var(--border-gradient-angle),
				var(--color-primary) 0%,
				var(--color-secondary) 50%,
				var(--color-primary) 100%
			);

			animation: 2s spin linear infinite;
		}

		&::before {
			filter: blur(0.1rem);
		}
	}

	@keyframes spin {
		from {
			--border-gradient-angle: 0deg;
		}

		to {
			--border-gradient-angle: 360deg;
		}
	}
</style>
