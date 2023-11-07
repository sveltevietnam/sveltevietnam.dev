<script lang="ts">
  import { getLangContext } from '$client/contexts/lang';
  import companyFallbackImg from '$shared/assets/images/fallback/company.webp';
  import type { Job } from '$shared/types';

  import { translations } from './translation';

  export let job: Job;
  let cls = '';
  export { cls as class };

  const langStore = getLangContext();
  $: lang = $langStore;

  $: t = translations[lang];
  $: tags = [!!job.sponsor && t.sponsored, job.salary, job.location, job.locationPolicy].filter(
    Boolean,
  );
</script>

<article class="job-card {cls}">
  <img src={job.image || companyFallbackImg} alt={job.company} height="80" width="80" />
  <div class="details">
    <p class="font-medium">
      <svg inline-src="icon/building" width="16" height="16" class="inline-block" />
      {job.company}
    </p>
    <p class="datetime tp-body2">
      <span>{t.posted}</span>
      <time datetime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString()}</time>
      {#if job.expiresAt}
        <span aria-disabled>-</span>
        <span>{t.expires}</span>
        <time datetime={job.expiresAt}>{new Date(job.expiresAt).toLocaleDateString()}</time>
      {/if}
    </p>
    <a class="title c-link c-link--preserved w-fit font-medium tp-h5" href={job.href} external
      >{job.title}</a
    >
  </div>
  <div class="tags">
    {#each tags as tag}
      <p class="c-tag">{tag}</p>
    {/each}
  </div>
</article>

<style lang="postcss">
  .job-card {
    display: grid;
    grid-template-areas:
      'img details'
      'tags tags';
    grid-template-columns: auto 1fr;
    grid-template-rows: auto auto;
    row-gap: 16px;
    column-gap: 24px;
  }

  img {
    grid-area: img;
  }

  .details {
    grid-area: details;
  }

  .datetime {
    margin-top: 6px;
    color: theme('colors.design.neutral.2');
  }

  .title {
    display: block;
    margin-top: 12px;
  }

  .tags {
    display: flex;
    grid-area: tags;
    flex-wrap: wrap;
    gap: 8px;

    height: fit-content;
  }
</style>
