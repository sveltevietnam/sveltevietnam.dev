<script lang="ts">
  import companyFallbackImg from '$shared/assets/images/fallback/company.png';
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
  <img src={job.image || companyFallbackImg} alt={job.company} height="auto" width="80" />
  <div class="details">
    <p class="company">
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
    <a class="title" href={job.href} target="_blank">{job.title}</a>
  </div>
  <div class="tags">
    {#each tags as tag}
      <p class="tag">{tag}</p>
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
    row-gap: 16px;
    column-gap: 24px;
  }

  img {
    grid-area: img;
  }

  .details {
    grid-area: details;
  }

  .company {
    font-size: 12px;

    @screen tb {
      font-size: 14px;
    }
  }

  .datetime {
    margin-top: 6px;
    font-size: 12px;
    color: theme('colors.design.neutral.2');
  }

  .title {
    display: block;

    margin-top: 12px;

    font-size: 16px;
    font-weight: 500;

    transition: color 400ms ease-out;

    &:hover {
      color: theme('colors.design.neutral.1');
    }

    @screen tb {
      font-size: 18px;
    }
  }

  .tags {
    display: flex;
    grid-area: tags;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    padding: 4px 10px;

    font-size: 12px;
    color: theme('colors.design.neutral.2');

    border: 1px solid theme('colors.design.border.1');
    border-radius: 25px;
  }
</style>
