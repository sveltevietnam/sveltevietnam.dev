<script lang="ts">
	import { onMount } from 'svelte';

	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import SectionBlog from './_page/sections/blog/SectionBlog.svelte';
	import SectionEvents from './_page/sections/events/SectionEvents.svelte';
	import SectionIntro from './_page/sections/intro/SectionIntro.svelte';
	import SectionResources from './_page/sections/resources/SectionResources.svelte';
	import SectionSponsor from './_page/sections/sponsor/SectionSponsor.svelte';

	let { data }: PageProps = $props();

	onMount(async () => {
		(await import('$lib/easter/hat-blow')).default();
	});
</script>

<main class="pt-header" {...pagefind.page()}>
	<SectionIntro />
	<SectionResources />
	<SectionEvents />
	<SectionBlog posts={data.posts} />
	<SectionSponsor />
</main>
