<script lang="ts">
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

<section class="intro intersect">
  <h1 title="Svelte Vietnam" class="intro-title">
    <svg inline-src="../images/intro-title" width="824" height="301" class="inline-block" />
  </h1>
  <ul class="intro-cards">
    <li>
      <article class="intro-card intro-card--svelte">
        <img src={introSvelteImg} alt="swirling winged-shaped star" width="60" height="60" />
        <h2>Svelte</h2>
        <div class="separator" aria-disabled />
        <p>{t.svelte}</p>
      </article>
    </li>
    <li>
      <article class="intro-card intro-card--vietnam">
        <img src={introVietnamImg} alt="five-pointed star" width="60" height="60" />
        <h2>Vietnam</h2>
        <div class="separator" aria-disabled />
        <p>{t.vietnam}</p>
      </article>
    </li>
    <li>
      <article class="intro-card intro-card--sveltevietnam">
        <img src={introSvelteVietnamImg} alt="eight-pointed start" width="60" height="60" />
        <h2>Svelte Vietnam</h2>
        <div class="separator" aria-disabled />
        <p>{t.sveltevietnam}</p>
      </article>
    </li>
  </ul>
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
  }

  .intro-cards {
    display: flex;
    column-gap: 25px;
    justify-content: center;
    margin-top: 136px;
  }

  .intro-card {
    width: 357px;
    height: 420px;
    padding: 20px;

    color: theme('colors.design.grayscale.dark.1');

    background: linear-gradient(to bottom, var(--bg-from), var(--bg-to));
    border-radius: 16px;

    @screen tb {
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

      margin-top: 56px;
    }

    &.intro-card--sveltevietnam {
      --bg-from: #fea74f;
      --bg-to: #fd952b;
      --transition-delay: 600ms;

      margin-top: 112px;
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
      margin: 16px 0;
      background-color: currentcolor;
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
    transition-timing-function: ease-out;
    transition-duration: 500ms;
    transition-property: transform, opacity;
  }

  .intro.intersect {
    & .intro-title,
    & .intro-card {
      transform: translateY(0);
      opacity: 1;
    }
  }

  .intro-backdrop {
    position: absolute;
    z-index: -1;
    inset: 0;

    & img {
      position: absolute;
      transform-origin: center;
      height: auto;
    }

    & .star {
      top: 15px;
      right: calc(50% + 281px);
      width: clamp(100px, 12vw, 174px);
    }

    & .ellipse {
      top: 321px;
      right: calc(50% + 165px);
      transform: rotate(-38deg);
      width: clamp(100px, 22vw, 317px);
    }

    & .triangle-small {
      top: 42px;
      left: calc(50% + 64px);
      transform-origin: 50% calc(56%);
      transform: rotate(-94deg);

      width: clamp(100px, 6.3vw, 94px);
    }

    & .triangle-large {
      top: 155px;
      left: calc(50% + 90px);
      transform-origin: 50% calc(65.5%);
      transform: rotate(-135deg);

      width: clamp(100px, 32vw, 461px);
    }
  }
</style>
