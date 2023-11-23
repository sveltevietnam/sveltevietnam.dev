<script lang="ts">
	// import { onMount } from 'svelte';

	// import { Power1, gsap } from '$3rd/gsap';
	import { intersect } from '$client/actions/intersect';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$client/components/SplitText';
	import { getLangContext } from '$client/contexts/lang';
	// import { getSplashContext } from '$client/contexts/splash';
	import { SOCIAL_LINKS } from '$shared/constants';
	// import { PEOPLE_PATH } from '$shared/services/navigation';

	// import communityShapeEllipse from '../images/community-shape-ellipse.webp';
	// import communityShapePolygon from '../images/community-shape-polygon.webp';
	// import communityShapeStar from '../images/community-shape-star.webp';
	import { translations } from '../translation';

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].community;

	// shapes
	// let shapeContainerElement: HTMLElement;

	// let shapesIntersected = false;
	// let parallaxTimeline: gsap.core.Timeline;

	// let ctx: gsap.Context;

	// $: if (shapeContainerElement) {
	//   ctx = gsap.context(() => {
	//     parallaxTimeline = gsap.timeline({
	//       scrollTrigger: {
	//         trigger: shapeContainerElement,
	//         start: 'top bottom',
	//         end: 'bottom top',
	//         scrub: true,
	//       },
	//     });
	//     parallaxTimeline.fromTo(
	//       'img',
	//       {
	//         x: (_, target: HTMLElement) => Number(gsap.getProperty(target, '--parallax-x')) * -1,
	//         y: (_, target: HTMLElement) => Number(gsap.getProperty(target, '--parallax-y')) * -1,
	//       },
	//       {
	//         x: (_, target: HTMLElement) => gsap.getProperty(target, '--parallax-x').toString(),
	//         y: (_, target: HTMLElement) => gsap.getProperty(target, '--parallax-y').toString(),
	//       },
	//       0,
	//     );
	//   }, shapeContainerElement);
	// }

	// onMount(() => {
	//   return () => {
	//     ctx?.revert();
	//   };
	// });

	// const splashStore = getSplashContext();
	// $: if (shapesIntersected && $splashStore?.done && shapeContainerElement) {
	//   gsap.to(shapeContainerElement.querySelectorAll('img'), {
	//     rotateX: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-x').toString(),
	//     rotateY: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-y').toString(),
	//     rotateZ: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-z').toString(),
	//     scale: (_, target: HTMLElement) => gsap.getProperty(target, '--scale').toString(),
	//     duration: 2.5,
	//     yoyo: true,
	//     repeat: -1,
	//     ease: Power1.easeInOut,
	//   });
	// }
</script>

<section class="community c-container-design" id="community">
	<h2 class="section-title tp-h2 uppercase">
		<ConsecutiveFadeUpIntro selector=".char" class="inline-block">
			<SplitText text={t.title} />
		</ConsecutiveFadeUpIntro>
	</h2>
	<p class="section-desc c-intersect mt-6" use:intersect>
		{@html t.description}
	</p>
	<!-- <div
    class="shapes c-intersect"
    role="figure"
    aria-label="geometric shapes"
    use:intersect
    on:intersect:once={() => (shapesIntersected = true)}
    bind:this={shapeContainerElement}
  >
    <img class="ellipse" src={communityShapeEllipse} alt="ellipse" width="363" height="403" />
    <img class="polygon" src={communityShapePolygon} alt="polygon" width="308" height="390" />
    <img class="star" src={communityShapeStar} alt="star" width="181" height="181" />
  </div> -->
	<ul class="ctas c-intersect divide-y divide-outline" use:intersect>
		<li>
			<a class="c-link c-link--box font-medium" href={SOCIAL_LINKS.DISCORD} external>
				<span>{t.ctas.discord}</span>
				<svg inline-src="icon/external-link" />
			</a>
		</li>
		<!-- <li>
      <a class="c-link c-link--box font-medium" href={PEOPLE_PATH}>
        <span>{t.ctas.nominate}</span>
      </a>
    </li> -->
		<li>
			<a class="c-link c-link--box font-medium" href={SOCIAL_LINKS.GITHUB} external>
				<span>{t.ctas.contribute}</span>
				<svg inline-src="icon/external-link" />
			</a>
		</li>
	</ul>
</section>

<style lang="postcss">
	.community {
		--padding-top: 80px;
		--padding-bottom: 80px;
		--gradient-top-height: 130px;
		--gradient-bottom-height: 130px;

		position: relative;
		padding-top: var(--padding-top);
		padding-bottom: var(--padding-bottom);

		&::before {
			content: '';

			position: absolute;
			z-index: -1;
			top: calc(var(--padding-top) - var(--gradient-top-height));
			right: 0;
			bottom: calc(var(--padding-bottom) - var(--gradient-bottom-height));
			left: 0;

			background-image: linear-gradient(
				to bottom,
				transparent,
				theme('colors.neutral.DEFAULT') var(--gradient-top-height),
				theme('colors.neutral.DEFAULT') calc(100% - var(--gradient-bottom-height)),
				transparent
			);
		}

		@screen tb {
			--padding-top: 160px;
			--gradient-top-height: 360px;
			--gradient-bottom-height: 360px;
		}
	}

	.section-title {
		grid-area: title;
	}

	.section-desc {
		grid-area: description;

		@screen sp {
			margin-top: 24px;
		}
	}

	.ctas {
		grid-area: ctas;
		margin-top: 30px;

		@screen tb {
			max-width: 548px;
			margin-top: 60px;
		}
	}
</style>
