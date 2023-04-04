<script lang="ts">
  import { onMount } from 'svelte';

  import { EventCard } from '$client/components/EventCard';
  import { JobCard } from '$client/components/JobCard';
  // import { ProjectCard } from '$client/components/ProjectCard';
  import { APP_ROUTE_TREE, GITHUB_LINKS, SOCIAL_LINKS } from '$shared/constants';

  import communityShapeEllipse from './_page/images/community-shape-ellipse.png';
  import communityShapePolygon from './_page/images/community-shape-polygon.png';
  import communityShapeStar from './_page/images/community-shape-star.png';
  import introShapeEllipse from './_page/images/intro-shape-ellipse.png';
  import introShapeTriangleLarge from './_page/images/intro-shape-triangle-large.png';
  import introShapeTriangleSmall from './_page/images/intro-shape-triangle-small.png';
  import introSvelteImg from './_page/images/intro-svelte.svg';
  import introSvelteVietnamImg from './_page/images/intro-sveltevietnam.svg';
  import introVietnamImg from './_page/images/intro-vietnam.svg';

  export let data;

  $: t = data.translations.page;

  $: eventsHref = APP_ROUTE_TREE[':lang'].events.$.path({
    args: {
      ':lang': data.language,
    },
  });
  $: jobsHref = APP_ROUTE_TREE[':lang'].jobs.$.path({
    args: {
      ':lang': data.language,
    },
  });
  $: impactHref = APP_ROUTE_TREE[':lang'].impact.$.path({
    args: {
      ':lang': data.language,
    },
  });
  $: sponsorHref = APP_ROUTE_TREE[':lang'].sponsor.$.path({
    args: {
      ':lang': data.language,
    },
  });

  let mounted = false;
  onMount(() => {
    mounted = true;
  });
</script>

<main class="page">
  <section class="intro" class:mounted>
    <h1 title="Svelte Vietnam" class="intro-title">
      <svg inline-src="./_page/images/intro-title" width="824" height="301" class="inline-block" />
    </h1>
    <ul class="intro-cards">
      <li>
        <article class="intro-card intro-card--svelte">
          <img src={introSvelteImg} alt="swirling winged-shaped star" width="60" height="60" />
          <h2>Svelte</h2>
          <div class="separator" aria-disabled />
          <p>{t.intro.svelte}</p>
        </article>
      </li>
      <li>
        <article class="intro-card intro-card--vietnam">
          <img src={introVietnamImg} alt="five-pointed star" width="60" height="60" />
          <h2>Vietnam</h2>
          <div class="separator" aria-disabled />
          <p>{t.intro.vietnam}</p>
        </article>
      </li>
      <li>
        <article class="intro-card intro-card--sveltevietnam">
          <img src={introSvelteVietnamImg} alt="eight-pointed start" width="60" height="60" />
          <h2>Svelte Vietnam</h2>
          <div class="separator" aria-disabled />
          <p>{t.intro.sveltevietnam}</p>
        </article>
      </li>
    </ul>
    <div aria-disabled class="intro-backdrop">
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
  <div class="community">
    <section class="section">
      <h2 class="section-title">{t.community.title}</h2>
      <p class="section-desc mt-6 pc:mt-8">{@html t.community.description}</p>
      <div class="shapes" role="figure" aria-label="geometric shapes">
        <img class="ellipse" src={communityShapeEllipse} alt="ellipse" width="363" height="403" />
        <img class="polygon" src={communityShapePolygon} alt="polygon" width="308" height="390" />
        <img class="star" src={communityShapeStar} alt="star" width="181" height="181" />
      </div>
      <ul class="ctas divide-border divide-y">
        <li class="pb-4">
          <a
            class="flex items-center justify-between"
            href={SOCIAL_LINKS.discord}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t.community.ctas.discord}</span>
            <svg inline-src="icon/external-link" />
          </a>
        </li>
        <li class="py-4">
          <a
            class="flex items-center justify-between"
            href={GITHUB_LINKS.ISSUE.CONTRIBUTOR_NOMINATION}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t.community.ctas.nominate}</span>
            <svg inline-src="icon/external-link" />
          </a>
        </li>
        <li class="pt-4">
          <a
            class="flex items-center justify-between"
            href={SOCIAL_LINKS.github}
            target="_blank"
            rel="noreferrer"
          >
            <span>{t.community.ctas.contribute}</span>
            <svg inline-src="icon/external-link" />
          </a>
        </li>
      </ul>
    </section>
  </div>

  <div class="others">
    <section class="section">
      <div class="section-title-container">
        <h2 class="section-title">
          {t.events.title}
        </h2>
        <a href={eventsHref} title={t.events.title}>
          <svg inline-src="icon/arrow-circle" width="64" height="64" class="arrow-circle" />
        </a>
      </div>
      <p class="section-desc mt-6 pc:mt-8">{t.events.description}</p>
      <ul class="mt-10 pc:mt-20 sp:ml-8">
        {#each data.events as event}
          <li>
            <EventCard {event} lang={data.language} />
          </li>
        {/each}
      </ul>
    </section>

    <section class="section">
      <div class="section-title-container">
        <h2 class="section-title">
          {t.jobs.title}
        </h2>
        <a href={jobsHref} title={t.jobs.title}>
          <svg inline-src="icon/arrow-circle" width="64" height="64" class="arrow-circle" />
        </a>
      </div>
      <p class="section-desc mt-6 pc:mt-8">{t.jobs.description}</p>
      <ul
        class="mt-10 grid grid-cols-1 gap-x-6 pc:mt-20 pc:grid-cols-3 pc:gap-y-10 tb:grid-cols-2 sp:gap-y-4"
      >
        {#each data.jobs as job}
          <li class="shrink-0">
            <JobCard {job} lang={data.language} class="h-full" />
          </li>
        {/each}
      </ul>
    </section>

    <section class="section">
      <div class="flex space-x-4 pc:space-x-6 tb:items-center sp:items-start">
        <h2 class="section-title impact">
          {t.impact.title}
        </h2>
        <a href={impactHref} title={t.impact.title}>
          <svg inline-src="icon/arrow-circle" width="64" height="64" class="arrow-circle" />
        </a>
      </div>
      <p class="section-desc mt-6 pc:mt-8">{t.impact.description}</p>
    </section>
  </div>

  <div class="sponsors">
    <section class="section">
      <div class="section-title-container">
        <h2 class="section-title">
          {t.sponsor.title}
        </h2>
        <a href={sponsorHref} title={t.sponsor.title}>
          <svg inline-src="icon/arrow-circle" width="64" height="64" class="arrow-circle" />
        </a>
      </div>
      <p class="section-desc mt-6 pc:mt-8">{t.sponsor.description}</p>
      <!-- FIXME: refactor to plain css here -->
      <ul class="mt-10 flex flex-wrap gap-x-[73px] gap-y-[62px] pc:mt-20">
        {#each new Array(6).fill(0) as _}
          <li class="flex items-center space-x-2 pc:space-x-4">
            <svg
              inline-src="sveltevietnam-grayscale"
              width="50"
              height="56"
              class="logo-grayscale sp:w-27 sp:w-30"
            />
            <p class="w-[50px] text-[11px] uppercase pc:w-[90px] pc:text-[20px]">Svelte Vietnam</p>
          </li>
        {/each}
      </ul>
    </section>
  </div>
</main>

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

  .intro.mounted {
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

  .section {
    margin-right: auto;
    margin-left: auto;
    padding-right: 16px;
    padding-left: 16px;

    @screen tb {
      max-width: 1024px;
      padding-right: 40px;
      padding-left: 40px;
    }

    @screen pc {
      max-width: 1440px;
      padding-right: 160px;
      padding-left: 160px;
    }
  }

  .section-title-container {
    @space-x 16px;

    display: flex;
    align-items: center;

    @screen tb {
      @space-x 24px;
    }
  }

  .section-title {
    font-family: theme('fontFamily.lora');
    font-size: 32px;
    font-weight: 500;
    text-transform: uppercase;

    @screen tb {
      font-size: 64px;
    }

    &.impact {
      @screen sp {
        max-width: 180px;
      }
    }
  }

  .section-desc {
    @screen tb {
      max-width: 560px;
      font-size: 18px;
    }
  }

  .arrow-circle {
    width: 48px;
    height: 48px;

    @screen tb {
      width: 64px;
      height: 64px;
    }
  }

  .community {
    --gradient-offset: 200px;

    margin-top: 16px;
    padding-top: 133px;
    padding-bottom: 126px;
    background: linear-gradient(
      to bottom,
      theme('colors.design.bg.1'),
      theme('colors.design.bg.2') var(--gradient-offset),
      theme('colors.design.bg.2') calc(100% - var(--gradient-offset)),
      theme('colors.design.bg.1') 100%
    );

    @screen tb {
      --gradient-offset: 200px;

      margin-top: 27px;
    }

    & > section {
      display: grid;
      grid-template-areas:
        'title'
        'description'
        'shapes'
        'ctas';

      @screen tb {
        grid-template-areas:
          'title shapes'
          'description shapes'
          'ctas shapes';
        grid-template-columns: minmax(560px, auto) auto;
        justify-content: space-between;
      }
    }

    & .section-title {
      grid-area: title;
    }

    & .section-desc {
      grid-area: description;

      @screen sp {
        margin-top: 24px;
      }
    }

    & .ctas {
      grid-area: ctas;
      margin-top: 30px;

      @screen sp {
        margin-left: 32px;
      }

      @screen tb {
        margin-top: 80px;
      }
    }

    & .shapes {
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
        width: clamp(100px, 31.5vw, 453px);
        height: auto;
      }

      & img {
        --rotate-x: 0deg;
        --rotate-y: 0deg;
        --rotate-z: 0deg;
        --scale-from: 1;
        --scale-to: 1;

        position: absolute;
        animation: shape 3s ease-in-out alternate infinite;

        &.ellipse {
          --rotate-x: -5deg;
          --rotate-y: 10deg;
          --rotate-z: -3deg;
          --scale-from: 1.02;

          bottom: 0;
          left: 0;
          width: 80%;
          height: auto;
        }

        &.polygon {
          --rotate-x: -4deg;
          --rotate-y: 8deg;
          --rotate-z: 2deg;
          --scale-from: 1.03;

          top: 0;
          left: 3.5%;
          width: 68%;
          height: auto;
        }

        &.star {
          --rotate-x: -10deg;
          --rotate-y: 12deg;
          --rotate-z: -5deg;
          --scale-to: 1.05;

          right: 0;
          bottom: 19.3%;
          width: 40%;
          height: auto;
        }
      }
    }
  }

  .others {
    @space-y 80px;

    @screen tb {
      @space-y 160px;
    }
  }

  .sponsors {
    --gradient-offset: 148px;

    margin-top: 80px;
    padding-bottom: 120px;
    background: linear-gradient(
      to bottom,
      theme('colors.design.bg.1'),
      theme('colors.design.bg.2') var(--gradient-offset),
      theme('colors.design.bg.2') 100%
    );

    @screen tb {
      --gradient-offset: 200px;

      padding-top: 80px;
      padding-bottom: 108px;
    }
  }

  @keyframes shape {
    0% {
      transform: rotateX(0) rotateY(0) rotateZ(0) scale(var(--scale-from));
    }

    100% {
      transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) rotateZ(var(--rotate-z))
        scale(var(--scale-to));
    }
  }
</style>
