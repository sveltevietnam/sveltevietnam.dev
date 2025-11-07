<script lang="ts">
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import { onMount } from 'svelte';

	import { listBlogPosts } from '$data/blog/posts';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import SectionBlog from './_page/sections/blog/SectionBlog.svelte';
	import SectionEvents from './_page/sections/events/SectionEvents.svelte';
	import SectionIntro from './_page/sections/intro/SectionIntro.svelte';
	import SectionResources from './_page/sections/resources/SectionResources.svelte';
	import SectionSponsor from './_page/sections/sponsor/SectionSponsor.svelte';

	let { data }: PageProps = $props();
	const routing = RoutingContext.get();
	onMount(async () => {
		(await import('$lib/easter/hat-blow')).default();
	});
</script>

<main class="pt-header" {...pagefind.page()}>
	<SectionIntro />
	<SectionResources />
	<SectionEvents events={data.events} />
	<SectionBlog posts={(await listBlogPosts({ lang: routing.lang, page: 1, per: 3 })).posts} />
	<SectionSponsor />
</main>
