<script lang="ts">
  import type { EmblaCarouselType } from 'embla-carousel';
  import embla from 'embla-carousel-svelte';

  import { intersect } from '$client/actions/intersect';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import type { Project } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let projects: Project[];

  $: t = translations[lang].impact;

  $: impactHref = APP_ROUTE_TREE[':lang'].impact.$.path({
    args: {
      ':lang': lang,
    },
  });

  let emblaProgress = 0;
  let emblaApi: EmblaCarouselType;
  function onEmblaInit(event: CustomEvent<EmblaCarouselType>) {
    emblaApi = event.detail;
    emblaApi.on('scroll', () => {
      emblaProgress = emblaApi.scrollProgress() * 100;
    });
  }
</script>

<section class="impact">
  <div class="c-container-design">
    <a href={impactHref} title={t.title} class="section-title-container">
      <h2 class="section-title">
        {t.title}
      </h2>
      <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16 sp:self-start" handle="parent" />
    </a>
    <p class="section-desc mt-6 pc:mt-8" use:intersect>{t.description}</p>
  </div>
  <div
    class="embla projects c-container-design"
    use:intersect
    use:embla={{
      options: {
        loop: true,
        align: 'start',
        inViewThreshold: 0.5,
      },
      plugins: [],
    }}
    on:init={onEmblaInit}
  >
    <ul class="embla__container">
      {#each projects as { description, image, name, collaboration, href }, i}
        <li class="project embla__slide">
          <div class="img-container">
            {#if image}
              <img src={image} alt={name} />
            {/if}
          </div>
          <div>
            <a class="title" {href}>{name}</a>
            <p class="description line-clamp-3 tb:line-clamp-4">{@html description}</p>
            <p class="collaboration">
              <span class="sp:hidden">{t.collaboration}</span>
              <span>{@html collaboration}</span>
            </p>
          </div>
        </li>
      {/each}
    </ul>
  </div>
  <div class="projects-pagination c-container-design">
    <p>01</p>
    <progress max="100" value={emblaProgress} />
    <p>{projects.length.toString().padStart(2, '0')}</p>
  </div>
</section>

<style lang="postcss">
  .impact {
    margin-top: 80px;

    @screen tb {
      margin-top: 160px;
    }
  }

  .section-title {
    @screen sp {
      max-width: 180px;
    }
  }

  .embla {
    overflow: hidden;
  }

  .embla__container {
    display: flex;
  }

  .embla__slide {
    flex: 0 0 100%;
    min-width: 0;
  }

  .projects {
    margin-top: 40px;
    padding-bottom: 10px;

    @screen tb {
      margin-top: 107px;
    }
  }

  .project {
    @space-x 4px;

    position: relative;

    overflow: hidden;
    display: flex;
    flex: 0 0 calc(83.2 * var(--container-max-width) / 100);
    flex-shrink: 0;
    align-items: flex-end;

    margin-left: 12px;
    padding: 69px 12px 12px;

    color: theme('colors.design.grayscale.light.1');

    border-top-left-radius: 40px;
    border-top-right-radius: 40px;

    @screen tb {
      @space-x 24px;

      flex: 0 0 calc(60 * var(--container-max-width) / 100);
      margin-left: 20px;
      padding: 234px 24px 28px;
    }

    @screen pc {
      flex: 0 0 calc(46.25 * var(--container-max-width) / 100);
      margin-left: 32px;
    }
  }

  .img-container {
    --fallback-bg: #d9d9d9;

    @dark {
      --fallback-bg: #1f1f1f;
    }

    position: absolute;
    z-index: -1;
    inset: 0;
    background: var(--fallback-bg);

    &::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(to bottom, rgb(0 0 0 / 0%) 50px, rgb(0 0 0 / 80%) 82.81%);

      @screen tb {
        background: linear-gradient(to bottom, rgb(0 0 0 / 0%) 200px, rgb(0 0 0 / 80%) 82.81%);
      }
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    display: block;
    font-size: 14px;
    font-weight: 700;
    transition: color 400ms ease-out;

    &:hover {
      color: theme('colors.design.neutral.1');
    }

    @screen tb {
      font-size: 24px;
    }
  }

  .description {
    margin-top: 8px;
    font-size: 12px;

    @screen tb {
      margin-top: 16px;
      font-size: 16px;
    }
  }

  .collaboration {
    display: flex;
    align-items: flex-start;
    margin-top: 8px;
    font-size: 12px;

    @screen tb {
      @space-x 24px;

      margin-top: 10px;
      font-size: 16px;
    }
  }

  .projects-pagination {
    @space-x 8px;

    display: flex;
    align-items: center;
    justify-content: flex-end;

    margin-top: 30px;

    font-family: theme('fontFamily.lora');
    font-size: 16px;
    font-weight: 700;

    @screen tb {
      margin-top: 70px;
      font-size: 24px;
    }
  }

  progress {
    width: 80px;
    height: 2px;
    appearance: none;
    background-color: theme('colors.design.border.1');

    &::-webkit-progress-bar {
      background-color: theme('colors.design.border.1');
    }

    &::-moz-progress-bar {
      background-color: theme('colors.design.fg.1');
    }

    &::-webkit-progress-value {
      background-color: theme('colors.design.fg.1');
    }

    @screen tb {
      width: 120px;
    }
  }
</style>
