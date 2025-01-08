<script lang="ts">
	import SectionBlog from './_page/sections/blog/SectionBlog.svelte';
	import SectionEvents from './_page/sections/events/SectionEvents.svelte';
	import SectionIntro from './_page/sections/intro/SectionIntro.svelte';
	import SectionResources from './_page/sections/resources/SectionResources.svelte';
	import SectionSponsor from './_page/sections/sponsor/SectionSponsor.svelte';

	let { data } = $props();
</script>

<main class="pt-header">
	<!-- intro section -->
	<SectionIntro locale={data.locales.sectionIntro} />
	<SectionResources locale={data.locales.sectionResources} />
	<SectionEvents locale={data.locales.sectionEvents} />
	<SectionBlog locale={data.locales.sectionBlog} posts={data.posts} />
	<SectionSponsor locale={data.locales.sectionSponsor} />
</main>
