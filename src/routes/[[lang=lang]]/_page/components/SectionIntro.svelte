<script lang="ts">
  import embla from 'embla-carousel-svelte';

  import { intersect } from '$client/actions/intersect';
  import type { Language } from '$shared/services/i18n';

  import introShapeEllipse from '../images/intro-shape-ellipse.png';
  import introShapeStar from '../images/intro-shape-star.png';
  import introShapeTriangleLarge from '../images/intro-shape-triangle-large.png';
  import introShapeTriangleSmall from '../images/intro-shape-triangle-small.png';
  import introSvelteImg from '../images/intro-svelte.svg';
  import introSvelteVietnamImg from '../images/intro-sveltevietnam.svg';
  import introVietnamImg from '../images/intro-vietnam.svg';
  import { translations } from '../translation';

  export let lang: Language;

  $: t = translations[lang].intro;
</script>

<section
  class="intro"
  use:intersect={{
    class: false,
    intersectedClass: 'intersected',
  }}
>
  <h1 title="Svelte Vietnam" class="intro-title">
    <svg inline-src="../images/intro-title" width="824" height="301" />
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
          <h2>Svelte</h2>
          <div class="separator" aria-disabled />
          <p>{t.svelte}</p>
        </article>
      </li>
      <li class="embla__slide intro-card intro-card--vietnam">
        <article>
          <img src={introVietnamImg} alt="five-pointed star" width="60" height="60" />
          <h2>Vietnam</h2>
          <div class="separator" aria-disabled />
          <p>{t.vietnam}</p>
        </article>
      </li>
      <li class="embla__slide intro-card intro-card--sveltevietnam">
        <article>
          <img src={introSvelteVietnamImg} alt="eight-pointed start" width="60" height="60" />
          <h2>Svelte Vietnam</h2>
          <div class="separator" aria-disabled />
          <p>{t.sveltevietnam}</p>
        </article>
      </li>
    </ul>
  </div>
  <div aria-disabled class="intro-backdrop">
    <img src={introShapeStar} alt="ellipse" width="174" height="174" class="star" />
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
    display: flex;
    justify-content: center;

    & svg {
      width: 328px;
      height: auto;

      @screen tb {
        width: 640px;
      }

      @screen pc {
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
    margin-top: 60px;

    @screen tb {
      margin-top: 100px;
    }

    @screen pc {
      margin-top: 136px;
    }
  }

  .intro-card {
    flex: 0 0 297px;

    height: fit-content;
    margin-left: 20px;
    padding: 20px;

    color: theme('colors.design.grayscale.dark.1');

    background: linear-gradient(to bottom, var(--bg-from), var(--bg-to));
    border-radius: 16px;

    @screen tb {
      flex: 0 0 357px;
      margin-left: 25px;
      padding: 24px;
      border-radius: 20px;
    }

    &.intro-card--svelte {
      --bg-from: #e1befc;
      --bg-to: #d49cff;
      --transition-delay: 200ms;
    }

    &.intro-card--vietnam {
      --bg-from: #d0e957;
      --bg-to: #bcd155;
      --transition-delay: 400ms;

      margin-top: 20px;

      @screen tb {
        margin-top: 56px;
      }
    }

    &.intro-card--sveltevietnam {
      --bg-from: #fea74f;
      --bg-to: #fd952b;
      --transition-delay: 600ms;

      margin-top: 40px;

      @screen tb {
        margin-top: 112px;
      }
    }

    & h2 {
      margin-top: 100px;
      font-family: theme('fontFamily.lora');
      font-size: 32px;
      font-weight: 700;

      @screen tb {
        margin-top: 136px;
      }
    }

    & .separator {
      width: 100%;
      height: 1px;
      margin: 12px 0;
      background-color: currentcolor;

      @screen pc {
        margin: 16px 0;
      }
    }

    & p {
      font-size: 16px;
    }
  }

  .intro-title,
  .intro-card {
    transform: translateY(80px);

    opacity: 0;

    transition-delay: var(--transition-delay, 0ms);
    transition-timing-function: cubic-bezier(0.45, 0.35, 0.52, 1.15);
    transition-duration: 500ms;
    transition-property: transform, opacity;
  }

  .intro-backdrop {
    position: absolute;
    z-index: -1;
    inset: 0;

    overflow: hidden;

    max-width: 100%;

    & img {
      /* initial transition */
      --initial-transition-duration: 1.4s;
      --initial-transition-delay: 0s;
      --initial-translate-x: 0;
      --initial-translate-y: 0;

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
      transform: translateX(var(--initial-translate-x)) translateY(var(--initial-translate-y))
        rotateX(0) rotateY(0) rotateZ(var(--rotate-z-from)) scale(1);

      height: auto;

      opacity: 0;

      transition-delay: var(--initial-transition-delay);
      transition-timing-function: ease-out, cubic-bezier(0.41, 0.78, 0.43, 0.96);
      transition-duration: var(--initial-transition-duration);
      transition-property: transform, opacity;
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

  :global(html.splashed .intro.intersected) {
    & .intro-title,
    & .intro-card {
      transform: translateY(0);
      opacity: 1;
    }

    & .intro-backdrop img {
      --initial-translate-x: 0;
      --initial-translate-y: 0;

      opacity: 1;
      animation: shape 3s var(--animation-delay) ease-in-out alternate infinite;
    }
  }

  @keyframes shape {
    0% {
      transform: translateX(0) translateY(0) rotateX(0) rotateY(0) rotateZ(var(--rotate-z-from))
        scale(1);
    }

    100% {
      transform: translateX(0) translateY(0) rotateX(var(--rotate-x)) rotateY(var(--rotate-y))
        rotateZ(var(--rotate-z-to)) scale(var(--scale));
    }
  }
</style>
