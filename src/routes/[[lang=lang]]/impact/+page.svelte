<script lang="ts">
  import { ProjectCard } from '$client/components/ProjectCard';
  import { EMAILS, GITHUB_LINKS, SOCIAL_LINKS } from '$shared/constants';

  export let data;

  $: t = data.translations.page;
</script>

<main class="c-page">
  <section class="c-page@header">
    <h1 class="c-page@h1">{t.title}</h1>
    <p class="c-page@h1-sub">{t.subtitle}</p>
  </section>

  <section class="c-action-card">
    <p>{@html t.description}</p>
    <div class="flex items-center max-md:flex-col max-md:space-y-4 md:space-x-4">
      <a href={GITHUB_LINKS.ISSUE.PUBLIC_PROJECT} target="_blank" rel="noreferrer" class="c-btn">
        <spanq>
          {@html t.ctas.github}
        </spanq>
        <svg inline-src="simpleicon/github" />
      </a>
      <a href={SOCIAL_LINKS.discord} target="_blank" rel="noreferrer" class="c-btn">
        <span>
          {t.ctas.discord}
        </span>
        <svg inline-src="simpleicon/discord" />
      </a>
      <a
        href="mailto:{EMAILS.impact}"
        target="_blank"
        rel="noreferrer"
        class="c-btn c-btn--outlined"
      >
        <span>
          {@html t.ctas.email}
        </span>
      </a>
    </div>
  </section>

  <section class="space-y-10">
    <h2 class="c-page@h2">{t.projectsInNeed.title}</h2>
    <ul class="space-y-10">
      {#each data.projects.inNeed as project}
        <li>
          <ProjectCard {project} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>

  <section class="space-y-10">
    <h2 class="c-page@h2">{t.projectsLaunched.title}</h2>
    <ul class="space-y-10">
      {#each data.projects.launched as project}
        <li>
          <ProjectCard {project} lang={data.language} />
        </li>
      {/each}
    </ul>
  </section>
</main>
