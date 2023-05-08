<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { splitFade } from '$client/actions/splitFade';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { JobCard } from '$client/components/JobCard';
  import { APP_ROUTE_TREE } from '$shared/constants';
  import type { Language } from '$shared/services/i18n';
  import type { Job } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let jobs: Job[];

  $: t = translations[lang].jobs;

  $: jobsHref = APP_ROUTE_TREE[':lang'].jobs.$.path({
    args: {
      ':lang': lang,
    },
  });
</script>

<section class="jobs c-container-design">
  <a href={jobsHref} title={t.title} class="section-title-container" use:splitFade>
    <h2 class="section-title">
      {t.title}
    </h2>
    <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
  </a>
  <p class="section-desc mt-6 pc:mt-8" use:intersect>{t.description}</p>
  <ul
    class="mt-10 grid grid-cols-1 gap-x-6 pc:mt-20 pc:grid-cols-3 pc:gap-y-10 tb:grid-cols-2 sp:gap-y-4"
  >
    {#each jobs as job}
      <li class="shrink-0" use:intersect>
        <JobCard {job} {lang} class="h-full" />
      </li>
    {/each}
  </ul>
</section>

<style lang="postcss">
  .jobs {
    margin-top: 80px;

    @screen tb {
      margin-top: 160px;
    }
  }
</style>
