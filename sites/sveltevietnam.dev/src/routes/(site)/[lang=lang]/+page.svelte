<script lang="ts">
	import { onMount } from 'svelte';

	import SectionBlog from './_page/sections/blog/SectionBlog.svelte';
	import SectionEvents from './_page/sections/events/SectionEvents.svelte';
	import SectionIntro from './_page/sections/intro/SectionIntro.svelte';
	import SectionResources from './_page/sections/resources/SectionResources.svelte';
	import SectionSponsor from './_page/sections/sponsor/SectionSponsor.svelte';

	let { data } = $props();

	onMount(async () => {
		(await import('$lib/easter/hat-blow')).default();
	});
</script>

<main class="pt-header">
	<SectionIntro />
	<SectionResources />
	<SectionEvents />
	<SectionBlog posts={data.posts} />
	<SectionSponsor />
</main>
