<script lang="ts">
	import type { PageData } from './$types';
	import SectionCommunity from './_page/components/SectionCommunity.svelte';
	import SectionEvents from './_page/components/SectionEvents.svelte';
	// import SectionImpact from './_page/components/SectionImpact.svelte';
	import SectionIntro from './_page/components/SectionIntro/SectionIntro.svelte';
	// import SectionJobs from './_page/components/SectionJobs.svelte';
	import SectionPosts from './_page/components/SectionPosts.svelte';
	import SectionSponsor from './_page/components/SectionSponsor.svelte';
	import './_page/page.css';

	export let data: PageData;
</script>

<main class="relative pb-[120px] tb:pb-[200px]">
	<SectionIntro />
	<SectionCommunity />
	<SectionEvents events={data.events} />
	<SectionPosts posts={data.posts.internal} externalPost={data.posts.external} />
	<!-- <SectionJobs jobs={data.jobs} /> -->
	<!-- <SectionImpact projects={data.projects} /> -->
	<SectionSponsor sponsors={data.sponsors} />
</main>
