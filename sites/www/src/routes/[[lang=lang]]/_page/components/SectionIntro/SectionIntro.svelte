<script lang="ts">
  import embla from 'embla-carousel-svelte';
  import { onMount } from 'svelte';

  import { gsap } from '$3rd/gsap';
  import { intersect } from '$client/actions/intersect';
  import { getSplashContext } from '$client/contexts/splash';
  import type { Language } from '$shared/services/i18n';
  import { translations as commonT } from '$shared/services/i18n/translations/common';

  import { translations } from '../../translation';

  import {
    createCardParallaxTimeline,
    createIntroTimeline,
    createScrollTimeline,
  } from './animation';
  import introShapeEllipse from './images/intro-shape-ellipse.webp';
  import introShapeStar from './images/intro-shape-star.webp';
  import introShapeTriangleLarge from './images/intro-shape-triangle-large.webp';
  import introShapeTriangleSmall from './images/intro-shape-triangle-small.webp';
  import introSvelteImg from './images/intro-svelte.svg';
  import introSvelteVietnamImg from './images/intro-sveltevietnam.svg';
  import introVietnamImg from './images/intro-vietnam.svg';

  export let lang: Language;

  $: t = translations[lang].intro;

  let sectionElement: HTMLElement;
  let intersected = false;

  let ctx: gsap.Context;
  let introTimeline: gsap.core.Timeline;

  $: if (sectionElement) {
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
    <svg inline-src="./images/intro-title" width="824" height="301" />
  </h1>
  <div
    class="intro-cards embla c-container-design"
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
          <img src={introSvelteImg} alt="swirling winged-shaped star" width="60" height="60" />
          <div>
            <p class="tp-h3 font-bold">Svelte</p>
            <div class="separator" aria-disabled />
            <p>{t.svelte}</p>
          </div>
        </article>
      </li>
      <li class="embla__slide intro-card intro-card--vietnam">
        <article>
          <img src={introVietnamImg} alt="five-pointed star" width="60" height="60" />
          <div>
            <p class="tp-h3 font-bold">Vietnam</p>
            <div class="separator" aria-disabled />
            <p>{t.vietnam}</p>
          </div>
        </article>
      </li>
      <li class="embla__slide intro-card intro-card--sveltevietnam">
        <article>
          <img src={introSvelteVietnamImg} alt="eight-pointed start" width="60" height="60" />
          <div>
            <p class="tp-h3 font-bold">{commonT[lang].sveltevienam}</p>
            <div class="separator" aria-disabled />
            <p>{t.sveltevietnam}</p>
          </div>
        </article>
      </li>
    </ul>
  </div>
  <div aria-disabled class="intro-backdrop">
    <img src={introShapeStar} alt="star" width="174" height="174" class="star" />
    <img src={introShapeEllipse} alt="ellipse" width="317" height="505" class="ellipse" />
    <img
      src={introShapeTriangleLarge}
      alt="triangle large"
      width="461"
      height="399"
      class="triangle-large"
    />
    <img
      src={introShapeTriangleSmall}
      alt="triangle small"
      width="100"
      height="86"
      class="triangle-small"
    />
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

    :global(html:--splashed) & {
      opacity: 0;
    }

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

    color: theme('colors.design.grayscale.dark.1');

    background: linear-gradient(to bottom, var(--bg-from), var(--bg-to));
    border-radius: 16px;

    @screen tb {
      flex: 0 0 357px;

      height: 420px;
      margin-left: 25px;
      padding: 24px;

      border-radius: 20px;
    }

    :global(html:--splashed) & {
      opacity: 0;
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

  .intro-backdrop {
    position: absolute;
    z-index: -1;
    inset: 0;

    overflow: hidden;

    max-width: 100%;

    & img {
      /* alternating pulsating animation */
      --animation-delay: calc(var(--initial-transition-delay) + var(--initial-transition-duration));
      --rotate-x: 0deg;
      --rotate-y: 0deg;
      --rotate-z-from: 0deg;
      --rotate-z-to: 0deg;
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
      transform: rotateX(0) rotateY(0) rotateZ(var(--rotate-z-from));

      height: auto;

      :global(html:--splashed) & {
        transform: translateX(var(--initial-translate-x)) translateY(var(--initial-translate-y))
          rotateX(0) rotateY(0) rotateZ(var(--rotate-z-from)) scale(1);
        opacity: 0;
      }
    }

    & .star {
      --initial-translate-x: -200px;
      --initial-translate-y: -200px;
      --rotate-x: -10deg;
      --rotate-y: 12deg;
      --rotate-z-from: 0deg;
      --rotate-z-to: 10deg;
      --scale: 1.05;
      --top: 38px;
      --right: calc(50% + 92px);

      right: calc(var(--right) + var(--delta-right));
      width: clamp(83px, 12vw, 174px);

      @screen tb {
        --top: 44px;
        --right: calc(50% + 200px);
      }

      @screen pc {
        --top: 15px;
        --right: calc(50% + 281px);
      }
    }

    & .ellipse {
      --initial-translate-x: -200px;
      --initial-translate-y: 50px;
      --initial-transition-delay: 400ms;
      --rotate-x: -5deg;
      --rotate-y: 10deg;
      --rotate-z-from: -38deg;
      --rotate-z-to: -25deg;
      --scale: 0.98;
      --top: 180px;
      --right: calc(50% + 58px);

      right: calc(var(--right) + var(--delta-right));
      width: clamp(175px, 22vw, 317px);

      @screen tb {
        --top: 260px;
        --right: calc(50% + 140px);
      }

      @screen pc {
        --top: 321px;
        --right: calc(50% + 165px);
      }
    }

    & .triangle-small {
      --initial-translate-x: 200px;
      --initial-translate-y: -200px;
      --initial-transition-delay: 300ms;
      --rotate-x: -4deg;
      --rotate-y: 8deg;
      --rotate-z-from: -94deg;
      --rotate-z-to: -80deg;
      --scale: 1.2;
      --top: 25px;
      --left: calc(50% + 64px);

      left: calc(var(--left) + var(--delta-left));
      transform-origin: 50% calc(56%);
      width: clamp(52px, 6.3vw, 94px);

      @screen tb {
        --top: 60px;
        --left: calc(50% + 80px);
      }

      @screen pc {
        --top: 42px;
      }
    }

    & .triangle-large {
      --initial-translate-x: 200px;
      --initial-translate-y: 100px;
      --initial-transition-delay: 200ms;
      --rotate-x: -4deg;
      --rotate-y: 8deg;
      --rotate-z-from: -135deg;
      --rotate-z-to: -140deg;
      --scale: 0.95;
      --top: 88px;
      --left: calc(50% + 83px);

      left: calc(var(--left) + var(--delta-left));
      transform-origin: 50% calc(65.5%);
      width: clamp(255px, 32vw, 461px);

      @screen tb {
        --top: 160px;
        --left: calc(50% + 120px);
      }

      @screen pc {
        --top: 155px;
        --left: calc(50% + 90px);
      }
    }
  }
</style>
