<script lang="ts">
  import type { Language } from '$shared/services/i18n';
  import type { Project } from '$shared/types';

  export let lang: Language;
  export let project: Project;
</script>

<article class="project-card">
  <div class="c-graphic md:h-[400px] md:w-[400px]" />
  <div class="space-y-4 md:space-y-8 md:py-10">
    <div class="flex items-center space-x-4">
      <p class="title">{project.name}</p>
      <svg data-inline-src="google/eco" />
    </div>
    <p class="space-x-4">
      <svg data-inline-src="google/diversity-1" class="inline-block" />
      <span>
        {project.description}
      </span>
    </p>
    {#if project.collaboration}
      <p class="space-x-4">
        <svg data-inline-src="google/handshake" class="inline-block" />
        <span>
          {project.collaboration}
        </span>
      </p>
    {/if}
    {#if project.href}
      <a href={project.href} target="_blank" rel="noreferrer" class="c-btn c-btn--text w-fit">
        <span>View details</span>
        <svg data-inline-src="google/arrow-right-alt" />
      </a>
    {/if}
  </div>
</article>

<style lang="postcss">
  .project-card {
    display: flex;

    @apply max-md:space-y-6 md:space-x-10;

    @media (max-width: theme('screens.md')) {
      flex-direction: column;
    }
  }

  .title {
    font-size: 28px;
    font-weight: theme('fontWeight.bold');
  }
</style>
