<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { createTimeline, onScroll, stagger, eases, type Timeline } from 'animejs';
	import { onMount } from 'svelte';

	import * as m from '$data/locales/generated/messages';
	import { SplitText } from '$lib/components/split-text';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import svgMesh from './images/mesh.svg?no-inline';

	const settings = SettingsContext.get();
	const { routing } = Contexts.get();

	let elSection: HTMLElement;

	// title
	let elTitle: SVGElement;
	let elRectWasher: SVGElement;
	let elCone: SVGElement;

	// subtitle
	let elSubtitleContainer: HTMLElement;
	let elSubtitle: HTMLParagraphElement;
	let elPyramid: SVGElement;
	let elDisk: SVGElement;

	let introTimeline = $state<Timeline | null>(null);
	let scrollTimeline: Timeline | null = null;
	onMount(() => {
		introTimeline = createTimeline({
			autoplay: false,
			onComplete: () => {
				scrollTimeline = createTimeline({
					autoplay: onScroll({
						target: elSection,
						enter: { target: '100%', container: '100%' },
						leave: { target: '100%', container: '50%' },
						sync: 0.75,
						repeat: true,
					}),
				})
					.add(elTitle, { opacity: 0, translateY: -200 }, 0)
					.add(elRectWasher, { opacity: 0, translateX: -80, translateY: -40 }, 0)
					.add(elCone, { opacity: 0, translateX: 80, translateY: -40 }, 0)
					.add(elPyramid, { opacity: 0, translateX: -20, rotate: 10 }, 0)
					.add(elDisk, { opacity: 0, translateX: 20, rotate: -10 }, 0)
					.add(elSubtitle, { scale: 1.5 }, 100)
					.init();
			},
		})
			.label('title')
			.add(elTitle, { opacity: [0, 1], translateY: [20, 0], duration: 750, ease: eases.outCubic })
			.add(
				elRectWasher,
				{ opacity: [0, 1], translateX: [-80, 0], translateY: [-40, 0], ease: eases.outCubic },
				'<<+=200',
			)
			.add(
				elCone,
				{ opacity: [0, 1], translateX: [80, 0], translateY: [-40, 0], ease: eases.outCubic },
				'<<+=200',
			)
			.label('subtitle', 'title+=200')
			.add(
				elPyramid,
				{ opacity: [0, 1], translateX: [-20, 0], rotate: [10, 0], ease: eases.outCubic },
				'subtitle',
			)
			.add(
				'.char',
				{ opacity: [0, 1], translateY: [5, 0], ease: eases.outQuart },
				stagger(25, {
					start: 'subtitle+=150',
				}),
			)
			.add(
				elDisk,
				{ opacity: [0, 1], translateX: [20, 0], rotate: [-10, 0], ease: eases.outCubic },
				'subtitle+=200',
			);

		return () => {
			introTimeline?.revert();
			scrollTimeline?.revert();
		};
	});

	$effect(() => {
		if (!introTimeline) return;
		if (!settings.splashed) {
			introTimeline.init();
		} else if (settings.splashed > settings.hydrated) {
			introTimeline.play();
		} else {
			introTimeline.complete();
		}
	});
</script>

<section
	class="max-w-pad -mt-header relative flex min-h-svh select-none flex-col items-center justify-center overflow-hidden"
	bind:this={elSection}
>
	<div class="space-y-15 tablet:space-y-20 desktop:space-y-24">
		<h1 class="relative mx-auto w-fit">
			<svg
				class="z-1 h-26 tablet:h-50 desktop:h-75 relative mx-auto w-auto"
				inline-src="./images/title"
				bind:this={elTitle}
			></svg>
			<span class="sr-only"><T message={m['pages.home.intro.heading']} /></span>

			<!-- absolute ornaments -->
			<svg
				class="tablet:-left-18 tablet:-top-24 desktop:-left-24 desktop:-top-28 tablet:h-48
				desktop:h-61 absolute -left-11 -top-14 z-0 h-28 w-auto"
				inline-src="./images/rect-washer"
				bind:this={elRectWasher}
			></svg>
			<svg
				class="tablet:-top-6 tablet:h-34.5 tablet:-right-28 desktop:-right-40 desktop:h-50 absolute -right-12 -top-3 z-0 h-20 w-auto"
				inline-src="./images/cone"
				bind:this={elCone}
			></svg>
		</h1>

		<div class="flex items-center justify-center gap-4" bind:this={elSubtitleContainer}>
			<svg
				class="h-15 tablet:h-20 desktop:h-25 w-auto shrink-0"
				inline-src="./images/pyramid"
				bind:this={elPyramid}
			></svg>
			<p
				class="font-lora tablet:text-2xl desktop:text-3xl select-text text-center text-lg font-medium leading-tight"
				bind:this={elSubtitle}
			>
				<SplitText text={m['pages.home.intro.subtitle'](routing.lang)} />
			</p>
			<svg
				class="h-15 tablet:h-20 desktop:h-25 w-auto shrink-0"
				inline-src="./images/disk"
				bind:this={elDisk}
			></svg>
		</div>
	</div>

	<div class="-z-px absolute inset-0 max-w-full overflow-hidden">
		<img
			class="-translate-1/2 absolute left-1/2 top-1/2 max-w-none opacity-40"
			src={svgMesh}
			alt=""
			width="1929"
			height="1647"
		/>
		<div
			class="w-100 h-100 tablet:w-150 tablet:h-150 desktop:w-200 desktop:h-200 bg-radial from-surface absolute left-0 top-1/2
			-translate-x-1/2 -translate-y-1/2 rounded-full to-transparent"
		>
			<!-- left gradient circle -->
		</div>
		<div
			class="w-100 h-100 tablet:w-150 tablet:h-150 bg-radial from-surface absolute right-0 top-1/2
			-translate-y-1/2 translate-x-1/2 rounded-full to-transparent"
		>
			<!-- left gradient circle -->
		</div>
		<div class="h-50 from-surface to-transprent absolute inset-x-0 bottom-0 bg-gradient-to-t"></div>
	</div>
</section>
