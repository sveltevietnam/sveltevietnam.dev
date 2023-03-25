<script lang="ts">
  import type { Language } from '$shared/services/i18n';
  import type { Job } from '$shared/types';

  import { translations } from './translation';

  export let lang: Language;
  export let job: Job;
  let cls = '';
  export { cls as class };

  $: t = translations[lang];

  $: tags = [job.salary, job.location, job.locationPolicy].filter(Boolean);
</script>

<article class="job-card {cls}">
  <div class="c-avatar" />
  <div class="space-y-2">
    <p class="font-bold">
      {job.title}
      {#if job.sponsored}
        <svg inline-src="google/volunteer-activism" class="ml-4 inline-block" />
      {/if}
    </p>
    <p class="text-sm">{job.title}</p>
    <p class="space-x-4 text-xs italic text-fg-300">
      <span>{t.posted} {new Date(job.createdAt).toLocaleDateString()}</span>
      {#if job.expiresAt}
        <span>{t.expires} {new Date(job.expiresAt).toLocaleDateString()}</span>
      {/if}
    </p>
    <div class="flex items-center gap-x-4">
      {#each tags as tag}
        <p class="tag">{tag}</p>
      {/each}
    </div>
  </div>
</article>

<style lang="postcss">
  .job-card {
    display: grid;
    grid-template-columns: auto 1fr;
    column-gap: theme('spacing.4');
    align-items: center;
  }

  .c-avatar {
    width: 100px;
    height: 100px;
  }

  .tag {
    display: grid;
    place-items: center;

    padding: theme('spacing.1') theme('spacing.2') theme('spacing[0.5]');

    font-size: theme('fontSize.2xs');
    text-transform: capitalize;

    background-color: theme('colors.bg.200');
    border-radius: theme('borderRadius.DEFAULT');

    @screen md {
      font-size: theme('fontSize.xs');
    }
  }
</style>
