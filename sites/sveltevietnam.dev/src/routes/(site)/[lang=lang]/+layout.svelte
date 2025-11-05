<script lang="ts">
	import { Footer } from '@sveltevietnam/kit/components';
	import { EMAILS } from '@sveltevietnam/kit/constants';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';
	import { onMount } from 'svelte';

	import { version } from '$app/environment';
	import { navigating, page } from '$app/state';
	import * as p from '$data/routes/generated';
	import * as n from '$data/routes/generated/names';
	import { Header } from '$lib/components/header';
	import { PageEditLink } from '$lib/components/page-edit-link';
	import { PageLoadIndicator } from '$lib/components/page-load-indicator';

	let { children } = $props();

	const routing = RoutingContext.get();

	onMount(async () => {
		(await import('$lib/easter/ascii-pho')).default();
	});

	let navigationPrimary = $derived([
		{
			path: p['/:lang']({ lang: routing.lang }),
			name: n['/:lang'](routing.lang),
		},
		{
			path: p['/:lang/blog']({ lang: routing.lang }),
			name: n['/:lang/blog'](),
		},
		{
			path: p['/:lang/events']({ lang: routing.lang }),
			name: n['/:lang/events'](routing.lang),
		},
		{
			path: p['/:lang/jobs']({ lang: routing.lang }),
			name: n['/:lang/jobs'](routing.lang),
		},
		{
			path: p['/:lang/sponsor']({ lang: routing.lang }),
			name: n['/:lang/sponsor'](routing.lang),
		},
		{
			path: p['/:lang/people']({ lang: routing.lang }),
			name: n['/:lang/people'](routing.lang),
		},
		{
			path: p['/:lang/roadmap']({ lang: routing.lang }),
			name: n['/:lang/roadmap'](routing.lang),
		},
		{
			path: p['/:lang/design']({ lang: routing.lang }),
			name: n['/:lang/design'](routing.lang),
		},
	] as const);
	let navigationSecondary = $derived([
		{
			path: p['/:lang/settings']({ lang: routing.lang }),
			name: n['/:lang/settings'](routing.lang),
		},
		{
			path: p['/:lang/code-of-conduct']({ lang: routing.lang }),
			name: n['/:lang/code-of-conduct'](routing.lang),
		},
		{
			path: p['/:lang/sitemap.xml']({ lang: routing.lang }),
			name: n['/:lang/sitemap.xml'](routing.lang),
		},
		{
			path: p['/:lang/rss.xml']({ lang: routing.lang }),
			name: n['/:lang/rss.xml'](),
		},
	] as const);
</script>

{#await navigating.complete}
	<PageLoadIndicator />
{/await}

<Header data-pagefind-ignore />
{@render children()}
{#if page.data.editUrl}
	<PageEditLink class="mt-auto" href={page.data.editUrl} id="edit-this-page" data-pagefind-ignore />
{/if}
<Footer
	email={EMAILS.CONTACT}
	domain="sveltevietnam.dev"
	{version}
	{navigationPrimary}
	{navigationSecondary}
	class={[!page.data.editUrl && 'mt-auto']}
	data-pagefind-ignore
/>
