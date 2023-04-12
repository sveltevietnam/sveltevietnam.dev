<script lang="ts">
  import {
    AnimatedArrowCircle,
    animatedArrowCircleContainerClass,
  } from '$client/components/AnimatedArrowCircle';
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
</script>

<section class="impact">
  <div class="c-container-design">
    <a
      href={impactHref}
      title={t.title}
      class="flex w-fit space-x-4 pc:space-x-6 tb:items-center sp:items-start {animatedArrowCircleContainerClass}"
    >
      <h2 class="section-title">
        {t.title}
      </h2>
      <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16" />
    </a>
    <p class="section-desc mt-6 pc:mt-8">{t.description}</p>
  </div>
  <ul class="projects c-container-design scrollbar-hidden">
    {#each projects as { description, image, name, collaboration, href }}
      <li class="project">
        <div class="img-container">
          {#if image}
            <img src={image} alt={name} />
          {/if}
        </div>
        <p class="title">{name}</p>
        <p class="description">{@html description}</p>
        <p class="collaboration">
          <span>{t.collaboration}</span>
          <span>{@html collaboration}</span>
        </p>
      </li>
    {/each}
  </ul>
  <div class="projects-pagination c-container-design">
    <p>01</p>
    <progress max="100" aria-busy />
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

  .projects {
    scroll-padding-left: var(--container-padding-x);
    scroll-snap-type: x mandatory;

    overflow-x: auto;
    display: flex;

    margin-top: 40px;
    padding-bottom: 10px;

    @screen tb {
      @space-x 32px;

      margin-top: 107px;
    }
  }

  .project {
    scroll-snap-align: start;
    scroll-snap-stop: always;

    position: relative;

    overflow: hidden;
    flex-shrink: 0;

    width: calc(46.25 * var(--container-max-width) / 100);
    padding: 69px 12px 12px;

    color: theme('colors.design.bg.1');

    border-top-left-radius: 40px;
    border-top-right-radius: 40px;

    @screen tb {
      padding: 234px 24px 24px;
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
      background: linear-gradient(to bottom, rgb(0 0 0 / 0%) 38.02%, rgb(0 0 0 / 80%) 82.81%);
    }

    & img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .title {
    font-size: 14px;
    font-weight: 700;

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

    @space-x 12px;

    margin-top: 8px;
    font-size: 12px;

    @screen tb {
      @space-x 24px;

      margin-top: 14px;
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
