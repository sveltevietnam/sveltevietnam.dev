<script lang="ts">
  import { EventCard } from '$client/components/EventCard';
  import { JobCard } from '$client/components/JobCard';
  // import { ProjectCard } from '$client/components/ProjectCard';
  import { APP_ROUTE_TREE, GITHUB_LINKS, SOCIAL_LINKS } from '$shared/constants';

  import communityShapeEllipsis from './_page/images/community-shape-ellipsis.png';
  import communityShapePolygon from './_page/images/community-shape-polygon.png';
  import communityShapeStar from './_page/images/community-shape-star.png';

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
</script>

<main class="page">
  <div class="community">
    <section class="section">
      <h2 class="section-title">{t.community.title}</h2>
      <p class="section-desc mt-6 pc:mt-8">{@html t.community.description}</p>
      <div class="shapes">
        <img
          class="ellipsis"
          src={communityShapeEllipsis}
          alt="ellipsis"
          width="363"
          height="403"
        />
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
        <a href={eventsHref} title={t.jobs.title}>
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
      <div class="flex items-start space-x-4 pc:space-x-6">
        <h2 class="section-title impact">
          {t.impact.title}
        </h2>
        <a href={eventsHref} title={t.impact.title}>
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
        <a href={eventsHref} title={t.sponsor.title}>
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
  .section {
    margin-right: auto;
    margin-left: auto;
    padding-right: 16px;
    padding-left: 16px;

    @screen pc {
      max-width: 1440px;
      padding-right: 160px;
      padding-left: 160px;
    }
  }

  .section-title-container {
    @mixin space x, 16px;

    display: flex;
    align-items: center;

    @screen pc {
      @mixin space x, 24px;
    }
  }

  .section-title {
    font-family: theme('fontFamily.lora');
    font-size: 32px;
    font-weight: 500;
    text-transform: uppercase;

    @screen pc {
      font-size: 64px;
    }

    &.impact {
      @screen sp {
        max-width: 180px;
      }
    }
  }

  .section-desc {
    @screen pc {
      max-width: 560px;
      font-size: 18px;
    }
  }

  .arrow-circle {
    width: 48px;
    height: 48px;

    @screen pc {
      width: 64px;
      height: 64px;
    }
  }

  .community {
    --gradient-offset: 200px;

    padding-top: 133px;
    padding-bottom: 126px;
    background: linear-gradient(
      to bottom,
      theme('colors.design.bg.1'),
      theme('colors.design.bg.2') var(--gradient-offset),
      theme('colors.design.bg.2') calc(100% - var(--gradient-offset)),
      theme('colors.design.bg.1') 100%
    );

    @screen pc {
      --gradient-offset: 200px;
    }

    & > section {
      display: grid;
      grid-template-areas:
        'title'
        'description'
        'shapes'
        'ctas';

      @screen pc {
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

      @screen pc {
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

      @screen pc {
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

        &.ellipsis {
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
    @mixin space y, 80px;

    @screen pc {
      @mixin space y, 160px;
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

    @screen pc {
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
