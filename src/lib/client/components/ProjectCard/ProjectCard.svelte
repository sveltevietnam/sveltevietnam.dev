<script lang="ts">
  import type { Project } from '$shared/types';

  export let project: Project;
</script>

<article class="project-card">
  <div class="c-graphic flex-shrink-0 md:h-[400px] md:w-[400px]" />
  <div class="space-y-4 md:space-y-8 md:py-10">
    <div class="flex items-center space-x-4">
      <p class="title">{project.name}</p>
      <svg inline-src="google/eco" />
    </div>
    <p class="space-x-4">
      <svg inline-src="google/diversity-1" class="inline-block" />
      <span>
        {project.description}
      </span>
    </p>
    {#if project.collaboration}
      <p class="space-x-4">
        <svg inline-src="google/handshake" class="inline-block" />
        <span>
          {project.collaboration}
        </span>
      </p>
    {/if}
    {#if project.href}
      <a
        href={project.href}
        target="_blank"
        rel="noreferrer"
        class="c-btn--with-icon c-btn c-btn--text w-fit"
      >
        <span>View details</span>
        <svg inline-src="google/arrow-right-alt" />
      </a>
    {/if}
  </div>
</article>

<style lang="postcss">
  .project-card {
    display: flex;

    @media (max-width: theme('screens.md')) {
      @space-y theme('spacing.6');

      flex-direction: column;
    }

    @screen md {
      @space-x theme('spacing.10');
    }
  }

  .title {
    font-size: 28px;
    font-weight: theme('fontWeight.bold');
  }
</style>
