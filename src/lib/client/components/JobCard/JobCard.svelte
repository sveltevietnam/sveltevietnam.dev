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
</script>

<article class="job-card {cls}">
  <img src={job.image || companyFallbackImg} alt={job.company} height="44" width="44" />
  <div class="flex-1">
    <p class="company">{job.company}</p>
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
    <div class="tags">
      {#if job.salary}
        <p class="tag salary">{job.salary}</p>
      {/if}
      {#if job.location}
        <p class="tag">{job.location}</p>
      {/if}
      {#if job.locationPolicy}
        <p class="tag">{job.locationPolicy}</p>
      {/if}
    </div>
  </div>
</article>

<style lang="postcss">
  .job-card {
    @space-x 12px;

    display: flex;
    align-items: flex-start;

    padding: 14px 16px;

    border: 1px solid theme('colors.design.border.1');
    border-radius: 12px;

    @screen tb {
      @space-x 14px;

      padding: 16px;
    }
  }

  .company {
    font-size: 12px;
  }

  .datetime {
    margin-top: 4px;
    font-size: 12px;
    font-style: italic;
  }

  .title {
    display: block;

    margin-top: 8px;
    margin-bottom: 16px;

    font-size: 14px;
    font-weight: 500;

    transition: color 400ms ease-out;

    &:hover {
      color: theme('colors.design.neutral.1');
    }

    @screen tb {
      margin-top: 10px;
      margin-bottom: 19px;
      font-size: 16px;
    }
  }

  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
  }

  .tag {
    --color: 85 76 133;

    padding: 4px 10px;

    font-size: 12px;
    color: rgb(var(--color));

    background-color: rgba(var(--color) / 10%);
    border: 1px solid rgba(var(--color) / 50%);
    border-radius: 25px;

    &.salary {
      --color: 171 55 127;
    }
  }
</style>
