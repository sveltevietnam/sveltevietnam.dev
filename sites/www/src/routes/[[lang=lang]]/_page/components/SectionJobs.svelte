<script lang="ts">
  import { intersect } from '$client/actions/intersect';
  import { splitFade } from '$client/actions/splitFade';
  import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
  import { JobCard } from '$client/components/JobCard';
  import type { Language } from '$shared/services/i18n';
  import { JOBS_PATH } from '$shared/services/navigation';
  import type { Job } from '$shared/types';

  import { translations } from '../translation';

  export let lang: Language;
  export let jobs: Job[];

  $: t = translations[lang].jobs;
</script>

<section class="jobs c-container-design">
  <a href={JOBS_PATH} title={t.title} class="section-title-container" use:splitFade>
    <h2 class="section-title">
      {t.title}
    </h2>
    <AnimatedArrowCircle class="h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
  </a>
  <p class="section-desc mt-6" use:intersect>{t.description}</p>
  <ul>
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
      margin-top: 120px;
    }
  }

  ul {
    display: grid;
    grid-template-columns: 1fr;
    row-gap: 40px;
    column-gap: 24px;

    margin-top: 40px;

    @screen tb {
      grid-template-columns: repeat(2, 1fr);
      margin-top: 60px;
    }
  }
</style>
