<script lang="ts">
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import { onMount } from 'svelte';

	import { listBlogPosts } from '$data/blog/posts';
	import { searchEvents } from '$data/events';
	import * as pagefind from '$lib/pagefind/attributes';

	import SectionBlog from './_page/sections/blog/SectionBlog.svelte';
	import SectionEvents from './_page/sections/events/SectionEvents.svelte';
	import SectionIntro from './_page/sections/intro/SectionIntro.svelte';
	import SectionResources from './_page/sections/resources/SectionResources.svelte';
	import SectionSponsor from './_page/sections/sponsor/SectionSponsor.svelte';

	const routing = RoutingContext.get();
	onMount(async () => {
		(await import('$lib/easter/hat-blow')).default();
	});

	const events = $derived(
		searchEvents({
			where: { status: ['upcoming', 'ongoing'] },
			pagination: { page: 1, per: 3 },
			optionalModules: { thumbnail: true },
		}),
	);
	const posts = $derived(listBlogPosts({ lang: routing.lang, page: 1, per: 3 }));
</script>

<main class="pt-header" {...pagefind.page()}>
	<SectionIntro />
	<SectionResources />
	<SectionEvents events={(await events).events} />
	<SectionBlog posts={(await posts).posts} />
	<SectionSponsor />
</main>
