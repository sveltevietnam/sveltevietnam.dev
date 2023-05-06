<script lang="ts">
  import embla from 'embla-carousel-svelte';
  import gsap from 'gsap';
  import { Power1 } from 'gsap';
  import { onMount } from 'svelte';

  import { intersect } from '$client/actions/intersect';
  import { splash } from '$client/components/SplashScreen';
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

  let sectionElement: HTMLElement;
  let titleElement: HTMLElement;
  // card elements
  let cardsContainerElement: HTMLElement;
  let svelteCardElement: HTMLElement;
  let vietnamCardElement: HTMLElement;
  let sveltevietnamCardElement: HTMLElement;
  $: cardElements = [svelteCardElement, vietnamCardElement, sveltevietnamCardElement];
  // shape elements
  let backdropElement: HTMLElement;
  let starElement: HTMLElement;
  let triangleLargeElement: HTMLElement;
  let triangleSmallElement: HTMLElement;
  let ellipseElement: HTMLElement;
  $: shapeElements = [starElement, triangleLargeElement, triangleSmallElement, ellipseElement];

  let intersected = false;

  let introTimeline: gsap.core.Timeline;
  let scrollTimeline: gsap.core.Timeline;
  let parallaxTimeline: gsap.core.Timeline;
  onMount(async () => {
    const ScrollTrigger = (await import('gsap/ScrollTrigger')).ScrollTrigger;
    gsap.registerPlugin(ScrollTrigger);

    // TODO: improve responsive animation with https://greensock.com/docs/v3/GSAP/gsap.matchMedia()

    // title & cards
    gsap.set([titleElement, ...cardElements], { opacity: 0, y: 80 });
    // shapes
    gsap.set(shapeElements, {
      x: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-x').toString(),
      y: (_, target: HTMLElement) => gsap.getProperty(target, '--initial-translate-y').toString(),
      rotateZ: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-z-from').toString(),
      opacity: 0,
    });
    gsap.set(sectionElement, { opacity: 1 });

    parallaxTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: sectionElement,
        start: 'top+=10 top',
        end: 'bottom center',
        scrub: 0.1,
        invalidateOnRefresh: true,
      },
      paused: true,
    });
    parallaxTimeline
      .fromTo(
        svelteCardElement,
        {
          y: 0,
        },
        {
          y: (_, target: HTMLElement) =>
            (target.parentElement?.offsetHeight ?? 0) - target.offsetHeight,
        },
        0,
      )
      .fromTo(
        sveltevietnamCardElement,
        {
          y: 0,
        },
        {
          y: (_, target: HTMLElement) =>
            target.offsetHeight - (target.parentElement?.offsetHeight ?? 0),
        },
        0,
      );

    scrollTimeline = gsap.timeline({
      scrollTrigger: {
        toggleActions: 'play none reverse none',
        start: 20,
        end: '+=1',
        invalidateOnRefresh: true,
      },
      paused: true,
      defaults: {
        duration: 1,
        ease: Power1.easeInOut,
      },
    });

    function getY() {
      const { top, height } = cardsContainerElement.getBoundingClientRect();
      const viewBoxHeight = window.innerHeight;
      if (top < viewBoxHeight / 2) {
        return -80;
      }
      const y = top - height / 2 - viewBoxHeight / 2;
      return y;
    }

    scrollTimeline
      .fromTo(
        sectionElement,
        {
          marginTop: 0,
        },
        {
          marginTop: getY,
        },
        0,
      )
      .fromTo(
        titleElement,
        {
          y: 0,
          opacity: 1,
        },
        {
          y: () => -0.5 * getY(),
          opacity: 0.1,
        },
        0,
      )
      .fromTo(
        backdropElement,
        {
          y: 0,
          opacity: 1,
        },
        {
          y: () => -0.5 * getY(),
          opacity: 0.1,
        },
        0,
      )
      .fromTo(
        shapeElements,
        {
          x: 0,
          y: 0,
        },
        {
          x: (_, target: HTMLElement) =>
            gsap.getProperty(target, '--initial-translate-x').toString(),
          y: (_, target: HTMLElement) =>
            gsap.getProperty(target, '--initial-translate-y').toString(),
        },
        0,
      );

    introTimeline = gsap.timeline({
      defaults: {
        ease: Power1.easeOut,
        duration: 0.8,
      },
      onComplete() {
        parallaxTimeline.play();
        scrollTimeline.play();
      },
      paused: true,
    });

    // title & cards
    introTimeline.to(
      [titleElement, ...cardElements],
      {
        y: 0,
        opacity: 1,
        duration: 0.5,
        stagger: 0.2,
      },
      0,
    );

    // shapes
    introTimeline
      .to(
        shapeElements,
        {
          opacity: 1,
          x: 0,
          y: 0,
          stagger: 0.15,
        },
        0,
      )
      .to(
        shapeElements,
        {
          rotateX: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-x').toString(),
          rotateY: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-y').toString(),
          rotateZ: (_, target: HTMLElement) => gsap.getProperty(target, '--rotate-z-to').toString(),
          scale: (_, target: HTMLElement) => gsap.getProperty(target, '--scale').toString(),
          repeat: -1,
          yoyo: true,
          duration: 3,
          ease: Power1.easeInOut,
          stagger: 0.1,
        },
        '>',
      );
    return () => {
      introTimeline?.kill();
      scrollTimeline?.kill();
      parallaxTimeline?.kill();
    };
  });

  $: if (intersected && $splash?.done && introTimeline) {
    introTimeline.play();
  }
</script>

<section
  class="intro"
  style="opacity: 0"
  class:intersected
  use:intersect={{ class: false, intersectedClass: false }}
  on:intersect:once={() => (intersected = true)}
  bind:this={sectionElement}
>
  <h1 title="Svelte Vietnam" class="intro-title" bind:this={titleElement}>
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
    bind:this={cardsContainerElement}
  >
    <ul class="embla__container">
      <li class="embla__slide intro-card intro-card--svelte" bind:this={svelteCardElement}>
        <article>
          <img src={introSvelteImg} alt="swirling winged-shaped star" width="60" height="60" />
          <h2>Svelte</h2>
          <div class="separator" aria-disabled />
          <p>{t.svelte}</p>
        </article>
      </li>
      <li class="embla__slide intro-card intro-card--vietnam" bind:this={vietnamCardElement}>
        <article>
          <img src={introVietnamImg} alt="five-pointed star" width="60" height="60" />
          <h2>Vietnam</h2>
          <div class="separator" aria-disabled />
          <p>{t.vietnam}</p>
        </article>
      </li>
      <li
        class="embla__slide intro-card intro-card--sveltevietnam"
        bind:this={sveltevietnamCardElement}
      >
        <article>
          <img src={introSvelteVietnamImg} alt="eight-pointed start" width="60" height="60" />
          <h2>Svelte Vietnam</h2>
          <div class="separator" aria-disabled />
          <p>{t.sveltevietnam}</p>
        </article>
      </li>
    </ul>
  </div>
  <div aria-disabled class="intro-backdrop" bind:this={backdropElement}>
    <img
      src={introShapeStar}
      alt="star"
      width="174"
      height="174"
      class="star"
      bind:this={starElement}
    />
    <img
      src={introShapeEllipse}
      alt="ellipse"
      width="317"
      height="505"
      class="ellipse"
      bind:this={ellipseElement}
    />
    <img
      src={introShapeTriangleLarge}
      alt="triangle large"
      width="461"
      height="399"
      class="triangle-large"
      bind:this={triangleLargeElement}
    />
    <img
      src={introShapeTriangleSmall}
      alt="triangle small"
      width="100"
      height="86"
      class="triangle-small"
      bind:this={triangleSmallElement}
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
    padding-top: 60px;

    @screen tb {
      padding-top: 100px;
    }

    @screen pc {
      padding-top: 136px;
    }
  }

  .intro-card {
    flex: 0 0 297px;

    height: 360px;
    margin-left: 20px;
    padding: 20px;

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
      font-size: 14px;

      @screen tb {
        font-size: 16px;
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
      transform: translateX(var(--initial-translate-x)) translateY(var(--initial-translate-y))
        rotateX(0) rotateY(0) rotateZ(var(--rotate-z-from)) scale(1);

      height: auto;
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
