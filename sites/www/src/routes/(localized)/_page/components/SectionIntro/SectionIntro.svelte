<script lang="ts">
	import embla from 'embla-carousel-svelte';
	import { onMount } from 'svelte';

	import { gsap } from '$3rd/gsap';
	import { getLangContext } from '$client/contexts/lang';
	import { getSplashContext } from '$client/contexts/splash';
	import { intersect } from '$lib/actions/intersect';
	import { translations as commonT } from '$shared/services/i18n/translations/common';

	import { translations } from '../../translation';

	import {
		createCardParallaxTimeline,
		createIntroTimeline,
		createScrollTimeline,
	} from './animation';
	import rhombusLargeImg from './images/rhombus-large.png?enhanced';
	import rhombusSmallImg from './images/rhombus-small.png?enhanced';
	import shapeSvelte from './images/shape-svelte.svg';
	import shapeSvelteVietnamImg from './images/shape-sveltevietnam.svg';
	import shapeVietnamImg from './images/shape-vietnam.svg';
	import starImg from './images/star.png?enhanced';
	import tabletImg from './images/tablet.png?enhanced';

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].intro;

	let sectionElement: HTMLElement;
	let intersected = false;

	let ctx: gsap.Context;
	let introTimeline: gsap.core.Timeline;

	$: if (sectionElement) {
		gsap.set('.intro-title', { opacity: 0 });
		gsap.set('.intro-card', { opacity: 0 });
		gsap.set('.intro-backdrop img', {
			opacity: 0,
			transform:
				'translateX(var(--initial-translate-x)) translateY(var(--initial-translate-y)) rotateX(0) rotateY(0) rotateZ(0) scale(1)',
		});
		ctx = gsap.context(() => {
			createCardParallaxTimeline(sectionElement);
			createScrollTimeline(sectionElement);
			introTimeline = createIntroTimeline();
		}, sectionElement);
	}

	onMount(() => {
		return () => {
			ctx?.revert();
		};
	});

	const splashStore = getSplashContext();
	$: if (intersected && $splashStore?.done && introTimeline) {
		introTimeline.play();
	}
</script>

<section
	class="intro"
	class:intersected
	use:intersect={{ class: false, intersectedClass: false }}
	on:intersect:once={() => (intersected = true)}
	data-intersect-threshold="0.2"
	bind:this={sectionElement}
>
	<h1 title={commonT[lang].sveltevienam} class="intro-title">
		<svg inline-src="./images/shape-title" width="824" height="301" />
	</h1>
	<div
		class="intro-cards embla max-w-pad"
		use:embla={{
			options: {
				align: 'start',
				breakpoints: {
					'(max-width: 767px)': { align: 'center' },
					'(min-width: 768px)': { align: 'center', startIndex: 1 },
					'(min-width: 1440px)': { active: false },
				},
			},
			plugins: [],
		}}
	>
		<ul class="embla__container">
			<li class="embla__slide intro-card intro-card--svelte">
				<article>
					<img src={shapeSvelte} alt="swirling winged-shaped star" width="60" height="60" />
					<div>
						<p class="c-text-h3 font-bold">Svelte</p>
						<div class="separator" aria-disabled />
						<p>{t.svelte}</p>
					</div>
				</article>
			</li>
			<li class="embla__slide intro-card intro-card--vietnam">
				<article>
					<img src={shapeVietnamImg} alt="five-pointed star" width="60" height="60" />
					<div>
						<p class="c-text-h3 font-bold">Vietnam</p>
						<div class="separator" aria-disabled />
						<p>{t.vietnam}</p>
					</div>
				</article>
			</li>
			<li class="embla__slide intro-card intro-card--sveltevietnam">
				<article>
					<img src={shapeSvelteVietnamImg} alt="eight-pointed start" width="60" height="60" />
					<div>
						<p class="c-text-h3 font-bold">{commonT[lang].sveltevienam}</p>
						<div class="separator" aria-disabled />
						<p>{t.sveltevietnam}</p>
					</div>
				</article>
			</li>
		</ul>
	</div>
	<div aria-disabled class="intro-mesh">
		<svg inline-src="./images/mesh" />
		<div class="radial-gradients" />
	</div>
	<div aria-disabled class="intro-backdrop">
		<enhanced:img src={starImg} alt="3D star" class="star" />
		<enhanced:img src={tabletImg} alt="3D tablet" class="tablet" />
		<enhanced:img src={rhombusLargeImg} alt="large 3D rhombus" class="rhombus-large" />
		<enhanced:img src={rhombusSmallImg} alt="small 3D rhombus" class="rhombus-small" />
	</div>
</section>

<style lang="postcss">
	.intro {
		position: relative;
		padding-top: 68px;

		@screen tb {
			padding-top: 104px;
		}
	}

	.intro-title {
		--initial-translate-y: 80px;

		display: flex;
		justify-content: center;

		& svg {
			width: 328px;
			height: auto;

			@screen tb {
				width: 640px;
			}

			@screen xl {
				width: 824px;
			}
		}
	}

	.embla {
		overflow: hidden;
	}

	.embla__container {
		display: flex;

		/* stylelint-disable-next-line media-feature-range-notation */
		@media (min-width: 1440px) {
			justify-content: center;
		}
	}

	.embla__slide {
		min-width: 0;
	}

	.intro-cards {
		padding-top: 60px;

		@screen tb {
			padding-top: 100px;
		}

		@screen pc {
			padding-top: 136px;
		}
	}

	.intro-card {
		--initial-translate-y: 80px;

		display: flex;
		flex: 0 0 298px;
		flex-direction: column;
		justify-content: space-between;

		height: 350px;
		margin-left: 20px;
		padding: 16px;

		color: theme('colors.grayscale.950');

		background: linear-gradient(to bottom, var(--bg-from), var(--bg-to));
		border-radius: 16px;

		@screen tb {
			flex: 0 0 357px;

			height: 420px;
			margin-left: 25px;
			padding: 24px;

			border-radius: 20px;
		}

		&.intro-card--svelte {
			--bg-from: #e1befc;
			--bg-to: #d49cff;
		}

		&.intro-card--vietnam {
			--bg-from: #d0e957;
			--bg-to: #bcd155;

			margin-top: 20px;

			@screen tb {
				margin-top: 56px;
			}
		}

		&.intro-card--sveltevietnam {
			--bg-from: #fea74f;
			--bg-to: #fd952b;

			margin-top: 40px;

			@screen tb {
				margin-top: 112px;
			}
		}

		& article {
			display: contents;
		}

		& img {
			width: 50px;
			height: 50px;

			@screen tb {
				width: 60px;
				height: 60px;
			}
		}

		& .separator {
			width: 100%;
			height: 1px;
			margin: 14px 0;
			background-color: currentcolor;

			@screen pc {
				margin: 16px 0;
			}
		}
	}

	.intro-mesh {
		position: absolute;
		z-index: -1;
		top: calc(-1 * var(--header-height));
		right: 0;
		bottom: 0;
		left: 0;

		overflow: hidden;

		max-width: 100%;

		&::after {
			content: '';

			position: absolute;
			right: 0;
			bottom: 0;
			left: 0;

			height: 250px;

			background: linear-gradient(to bottom, transparent, theme('colors.bg.DEFAULT'));

			@screen tb {
				height: 400px;
			}
		}

		& .radial-gradients {
			&::before,
			&::after {
				content: '';

				position: absolute;
				top: 50%;
				right: 0;
				transform: translate(50%, -50%);

				width: 400px;
				height: 400px;

				background: radial-gradient(theme('colors.bg.DEFAULT'), transparent);
				border-radius: 50%;

				@screen pc {
					width: 600px;
					height: 600px;
				}
			}

			&::before {
				left: 0;
				transform: translate(-50%, -50%);
			}
		}

		& svg {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);

			opacity: 0.4;
		}
	}

	.intro-backdrop {
		position: absolute;
		z-index: -1;
		inset: 0;

		overflow: hidden;

		max-width: 100%;

		& img {
			/* sizing */
			--width-pc: 500;
			--width-sp: 200;

			/* alternating pulsating animation */
			--animation-delay: calc(var(--initial-transition-delay) + var(--initial-transition-duration));
			--rotate-x: 0deg;
			--rotate-y: 0deg;
			--rotate-z: 0deg;
			--scale: 1;

			/* positioning */
			--left: 0px;
			--delta-left: 0px;
			--top: 0px;
			--delta-top: 0px;
			--right: 0px;
			--delta-right: 0px;

			position: absolute;
			top: calc(var(--top) + var(--delta-top));
			transform-origin: center;
			transform: rotateX(0) rotateY(0) rotateZ(0);

			width: clamp(
				calc(var(--width-sp) * 1px),
				calc(100vw * var(--width-pc) / 1440),
				calc(var(--width-pc) * 1px)
			);
			height: auto;
		}

		& .star {
			--width-pc: 248;
			--width-sp: 144;
			--initial-translate-x: -200px;
			--initial-translate-y: -200px;
			--rotate-x: -10deg;
			--rotate-y: 12deg;
			--rotate-z: 10deg;
			--scale: 1.05;
			--top: 10px;
			--right: calc(50% + 63px);

			right: calc(var(--right) + var(--delta-right));

			@screen tb {
				--top: 44px;
				--right: calc(50% + 200px);
			}

			@screen pc {
				--top: 0;
				--right: calc(50% + 270px);
			}
		}

		& .tablet {
			--width-pc: 480;
			--width-sp: 280;
			--initial-translate-x: -200px;
			--initial-translate-y: 50px;
			--initial-transition-delay: 400ms;
			--rotate-x: -5deg;
			--rotate-y: 10deg;
			--rotate-z: 10deg;
			--scale: 0.98;
			--top: 155px;
			--right: calc(50% + 14px);

			right: calc(var(--right) + var(--delta-right));

			@screen tb {
				--top: 200px;
				--right: calc(50% + 120px);
			}

			@screen pc {
				--top: 269px;
				--right: calc(50% + 135px);
			}
		}

		& .rhombus-small {
			--width-pc: 188;
			--width-sp: 110;
			--initial-translate-x: 200px;
			--initial-translate-y: -200px;
			--initial-transition-delay: 300ms;
			--rotate-x: -4deg;
			--rotate-y: 8deg;
			--rotate-z: -6deg;
			--scale: 1.2;
			--top: 0;
			--left: calc(50% + 32px);

			left: calc(var(--left) + var(--delta-left));

			@screen tb {
				--left: calc(50% + 120px);
			}

			@screen pc {
				--left: calc(50% + 110px);
			}
		}

		& .rhombus-large {
			--width-pc: 658;
			--width-sp: 384;
			--initial-translate-x: 200px;
			--initial-translate-y: 100px;
			--initial-transition-delay: 200ms;
			--rotate-x: -4deg;
			--rotate-y: 8deg;
			--rotate-z: -5deg;
			--scale: 0.95;
			--top: 74px;
			--left: calc(50% - 4px);

			left: calc(var(--left) + var(--delta-left));

			@screen tb {
				--top: 180px;
				--left: calc(50% + 32px);
			}

			@screen pc {
				--top: 152px;
				--left: calc(50% + 44px);
			}
		}
	}
</style>
