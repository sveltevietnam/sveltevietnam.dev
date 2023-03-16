<script lang="ts">
  import { EventCard } from '$client/components/EventCard';
  import { JobCard } from '$client/components/JobCard';
  import { ProjectCard } from '$client/components/ProjectCard';
  import { APP_ROUTE_TREE, GITHUB_LINKS, SOCIAL_LINKS } from '$shared/constants';

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

<main class="c-page">
  <section class="c-page@header">
    <h1 class="c-page@h1">Svelte Vietnam</h1>
  </section>

  <section class="grid grid-cols-1 gap-10 md:grid-cols-2">
    <h2 hidden>Introduction</h2>
    <article class="c-action-card">
      <div class="c-graphic" />
      <p class="c-page@h2">Svelte</p>
      <p>{t.introduction.svelte}</p>
    </article>
    <article class="c-action-card">
      <div class="c-graphic" />
      <p class="c-page@h2">Vietnam</p>
      <p>{t.introduction.vietnam}</p>
    </article>
    <article class="c-action-card md:col-span-2">
      <div class="c-graphic" />
      <p class="c-page@h2">Svelte Vietnam</p>
      <p>{t.introduction.svelteVietnam}</p>
    </article>
  </section>

  <section class="space-y-10">
    <h2 class="c-page@h2">{t.community.title}</h2>
    <p>{@html t.community.description}</p>
    <div class="flex items-center justify-center max-md:flex-col max-md:space-y-6 md:space-x-6">
      <a class="c-btn" href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer">
        <span>{t.community.ctas.discord}</span>
        <svg data-inline-src="simpleicon/discord" />
      </a>
      <a
        class="c-btn--outlined c-btn"
        href={GITHUB_LINKS.ISSUE.CONTRIBUTOR_NOMINATION}
        target="_blank"
        rel="noreferrer"
      >
        {t.community.ctas.nominate}
      </a>
      <a class="c-btn" href={SOCIAL_LINKS.github} target="_blank" rel="noreferrer">
        <span>{t.community.ctas.contribute}</span>
        <svg data-inline-src="simpleicon/github" />
      </a>
    </div>
  </section>

  <section class="space-y-10">
    <div class="flex items-center justify-between">
      <h2 class="c-page@h2">{t.events.title}</h2>
      <a href={eventsHref} class="c-btn c-btn--text">
        <span>{t.events.ctas.viewMore}</span>
        <svg data-inline-src="google/arrow-right-alt" />
      </a>
    </div>
    <p>{t.events.description}</p>
    <ul class="space-y-10">
      {#each data.events as event}
        <li>
          <EventCard {event} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>

  <section class="space-y-10">
    <div class="flex items-center justify-between">
      <h2 class="c-page@h2">{t.jobs.title}</h2>
      <a href={jobsHref} class="c-btn c-btn--text">
        <span>{t.jobs.ctas.viewMore}</span>
        <svg data-inline-src="google/arrow-right-alt" />
      </a>
    </div>
    <p>{t.jobs.description}</p>
    <ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
      {#each data.jobs as job}
        <li>
          <JobCard {job} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>

  <section class="space-y-10">
    <div class="flex items-center justify-between">
      <h2 class="c-page@h2">{t.impact.title}</h2>
      <a href={impactHref} class="c-btn c-btn--text">
        <span>{t.impact.ctas.viewMore}</span>
        <svg data-inline-src="google/arrow-right-alt" />
      </a>
    </div>
    <p>{t.impact.description}</p>
    <ul class="space-y-10">
      {#each data.projects as project}
        <li>
          <ProjectCard {project} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>

  <section class="space-y-10">
    <div class="flex items-center justify-between">
      <h2 class="c-page@h2">{t.sponsor.title}</h2>
      <a href={sponsorHref} class="c-btn c-btn--text">
        <span>{t.sponsor.ctas.viewMore}</span>
        <svg data-inline-src="google/arrow-right-alt" />
      </a>
    </div>
    <p>{t.sponsor.description}</p>
    <ul class="flex items-center space-x-4">
      <li class="c-avatar" />
      <li class="c-avatar" />
      <li class="h-[40px] w-[100px] rounded bg-bg-300" />
      <li class="c-avatar" />
    </ul>
  </section>
</main>
