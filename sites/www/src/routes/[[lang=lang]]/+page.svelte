<script lang="ts">
  import type { PageData } from './$types';
  import SectionCommunity from './_page/components/SectionCommunity.svelte';
  import SectionEvents from './_page/components/SectionEvents.svelte';
  import SectionImpact from './_page/components/SectionImpact.svelte';
  import SectionIntro from './_page/components/SectionIntro/SectionIntro.svelte';
  import SectionJobs from './_page/components/SectionJobs.svelte';
  import SectionSponsor from './_page/components/SectionSponsor.svelte';
  import './_page/page.css';

  export let data: PageData;
</script>

<main class="page">
  <SectionIntro lang={data.language} />
  <SectionCommunity lang={data.language} />
  <section class="c-container-design mb-20 bg-bg-300 py-6 text-fg-100">
    <p>
      <svg
        class="inline-block"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        ><rect x="2" y="6" width="20" height="8" rx="1" /><path d="M17 14v7" /><path
          d="M7 14v7"
        /><path d="M17 3v3" /><path d="M7 3v3" /><path d="M10 14 2.3 6.3" /><path
          d="m14 6 7.7 7.7"
        /><path d="m8 6 8 8" /></svg
      >
      {@html data.underConstructionNote}
    </p>
  </section>
  <SectionEvents lang={data.language} events={data.events} />
  <SectionJobs lang={data.language} jobs={data.jobs} />
  <SectionImpact lang={data.language} projects={data.projects} />
  <SectionSponsor lang={data.language} sponsors={data.sponsors} />
</main>
