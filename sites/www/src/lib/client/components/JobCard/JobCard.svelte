<script lang="ts">
  import companyFallbackImg from '$shared/assets/images/fallback/company.webp';
  import type { Language } from '$shared/services/i18n';
  import type { Job } from '$shared/types';

  import { translations } from './translation';

  export let lang: Language;
  export let job: Job;
  let cls = '';
  export { cls as class };

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
    <p class="datetime">
      <span>{t.posted}</span>
      <time datetime={job.createdAt}>{new Date(job.createdAt).toLocaleDateString()}</time>
      {#if job.expiresAt}
        <span aria-disabled>-</span>
        <span>{t.expires}</span>
        <time datetime={job.expiresAt}>{new Date(job.expiresAt).toLocaleDateString()}</time>
      {/if}
    </p>
    <a class="title font-medium tp-h5" href={job.href} target="_blank">{job.title}</a>
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
    transition: color 400ms ease-out;

    &:hover {
      color: theme('colors.design.link.title');
    }
  }

  .tags {
    display: flex;
    grid-area: tags;
    flex-wrap: wrap;
    gap: 8px;

    height: fit-content;
  }
</style>
