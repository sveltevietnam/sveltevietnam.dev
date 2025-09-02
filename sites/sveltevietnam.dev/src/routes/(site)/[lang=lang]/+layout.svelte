<script lang="ts">
	import { onMount } from 'svelte';

	import { version } from '$app/environment';
	import { navigating, page } from '$app/state';
	import { Footer } from '$lib/components/footer';
	import { Header } from '$lib/components/header';
	import { PageEditLink } from '$lib/components/page-edit-link';
	import { PageLoadIndicator } from '$lib/components/page-load-indicator';

	let { children } = $props();

	onMount(async () => {
		(await import('$lib/easter/ascii-pho')).default();
	});
</script>

{#await navigating.complete}
	<PageLoadIndicator />
{/await}

<Header data-pagefind-ignore />
{@render children()}
{#if page.data.editUrl}
	<PageEditLink class="mt-auto" href={page.data.editUrl} id="edit-this-page" data-pagefind-ignore />
{/if}
<Footer class={[!page.data.editUrl && 'mt-auto']} {version} data-pagefind-ignore />
