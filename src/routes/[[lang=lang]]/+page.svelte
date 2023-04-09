<script lang="ts">
  import SectionCommunity from './_page/components/SectionCommunity.svelte';
  import SectionEvents from './_page/components/SectionEvents.svelte';
  import SectionImpact from './_page/components/SectionImpact.svelte';
  import SectionIntro from './_page/components/SectionIntro.svelte';
  import SectionJobs from './_page/components/SectionJobs.svelte';
  import SectionSponsor from './_page/components/SectionSponsor.svelte';
  import './_page/style.css';

  export let data;
</script>

<main class="page">
  <SectionIntro lang={data.language} />
  <SectionCommunity lang={data.language} />
  <SectionEvents lang={data.language} events={data.events} />
  <SectionJobs lang={data.language} jobs={data.jobs} />
  <SectionImpact lang={data.language} projects={data.projects} />
  <SectionSponsor lang={data.language} sponsors={data.sponsors} />
</main>
