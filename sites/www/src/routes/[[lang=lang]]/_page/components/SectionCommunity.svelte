<script lang="ts">
  // import { onMount } from 'svelte';

  // import { Power1, gsap } from '$3rd/gsap';
  import { intersect } from '$client/actions/intersect';
  import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
  import { SplitText } from '$client/components/SplitText';
  // import { splash } from '$client/components/SplashScreen';
  import { SOCIAL_LINKS } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import { PEOPLE_PATH } from '$shared/services/navigation';

  // import communityShapeEllipse from '../images/community-shape-ellipse.webp';
  // import communityShapePolygon from '../images/community-shape-polygon.webp';
  // import communityShapeStar from '../images/community-shape-star.webp';
  import { translations } from '../translation';

  export let lang: Language;

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

  // $: if (shapesIntersected && $splash?.done && shapeContainerElement) {
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
  <ul class="ctas divide-border c-intersect divide-y" use:intersect>
    <li>
      <a class="cta font-medium" href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer">
        <span>{t.ctas.discord}</span>
        <svg inline-src="icon/external-link" />
      </a>
    </li>
    <li>
      <a class="cta font-medium" href={PEOPLE_PATH} rel="noreferrer">
        <span>{t.ctas.nominate}</span>
      </a>
    </li>
    <li>
      <a class="cta font-medium" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
        <span>{t.ctas.contribute}</span>
        <svg inline-src="icon/external-link" />
      </a>
    </li>
  </ul>
</section>

<style lang="postcss">
  .community {
    --gradient-offset: 200px;

    /* overflow: hidden; */

    /* display: grid; */

    /* grid-template-areas:
      'title'
      'description'
      'shapes'
      'ctas'; */

    padding-top: 80px;
    padding-bottom: 80px;
    background: linear-gradient(
      to bottom,
      theme('colors.design.bg.1'),
      theme('colors.design.bg.2') var(--gradient-offset),
      theme('colors.design.bg.2') calc(100% - var(--gradient-offset)),
      theme('colors.design.bg.1') 100%
    );

    @screen tb {
      --gradient-offset: 200px;

      /* grid-template-areas:
        'title shapes'
        'description shapes'
        'ctas shapes';
      grid-template-columns: minmax(380px, auto) auto; */

      /* justify-content: space-between; */
      padding-top: 160px;
    }

    /* @screen pc {
      grid-template-columns: minmax(560px, auto) auto;
    } */
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

    @screen sp {
      margin-left: 32px;
    }

    @screen tb {
      max-width: 548px;
      margin-top: 60px;
    }
  }

  .cta {
    --transition-duration: 300ms;

    position: relative;

    display: flex;
    align-items: center;
    justify-content: space-between;

    padding: 16px 0;

    &::before {
      content: '';

      position: absolute;
      inset: 0;
      transform-origin: left;
      transform: scaleX(0);

      opacity: 0;
      background-color: theme('colors.design.fg.1');

      transition-timing-function: ease-in-out;
      transition-duration: var(--transition-duration);
      transition-property: opacity, transform;
    }

    & span,
    & svg {
      transition-timing-function: ease-in-out;
      transition-duration: var(--transition-duration);
      transition-property: color, transform;
    }

    &:hover {
      &::before {
        transform: scaleX(1);
        opacity: 1;
      }

      & span,
      & svg {
        color: theme('colors.design.bg.1');
      }

      & span {
        transform: translateX(12px);
      }

      & svg {
        transform: translateX(-12px);
      }
    }
  }

  /* .shapes {
    position: relative;

    grid-area: shapes;

    aspect-ratio: 285 / 277;
    width: clamp(100px, 79.1vw, 285px);
    height: auto;
    margin-left: auto;

    @screen sp {
      margin-top: 20px;
    }

    @screen tb {
      aspect-ratio: 453 / 478;
      width: clamp(100px, 25vw, 453px);
      height: auto;
    }

    & img {
      position: absolute;

      &.ellipse {
        --parallax-x: 15px;
        --parallax-y: -40px;

        --rotate-x: -5deg;
        --rotate-y: 10deg;
        --rotate-z: -3deg;
        --scale: 0.98;

        bottom: 0;
        left: 0;
        width: 80%;
        height: auto;
      }

      &.polygon {
        --parallax-x: -20px;
        --parallax-y: 30px;

        --rotate-x: -4deg;
        --rotate-y: 8deg;
        --rotate-z: 2deg;
        --scale: 0.97;

        top: 0;
        left: 3%;
        width: 68%;
        height: auto;
      }

      &.star {
        --parallax-x: -20px;
        --parallax-y: -60px;

        --rotate-x: -10deg;
        --rotate-y: 12deg;
        --rotate-z: -5deg;
        --scale: 1.05;

        right: 0;
        bottom: 19.3%;
        width: 40%;
        height: auto;
      }
    }
  } */
</style>
