<script lang="ts">
	import { lockscroll } from '@svelte-put/lockscroll';
	import { onMount } from 'svelte';

	import { dev, version } from '$app/environment';
	import { navigating, page } from '$app/state';
	import { Footer } from '$lib/components/footer';
	import { Header } from '$lib/components/header';
	import { PageEditLink } from '$lib/components/page-edit-link';
	import { PageLoadIndicator } from '$lib/components/page-load-indicator';
	import { V1SiteConstruction } from '$lib/notifications/components/v1-site-construction';
	import { NotificationContext } from '$lib/notifications/context.svelte.js';
	import { SettingsContext } from '$lib/settings/context.svelte.js';

	let { children } = $props();

	const settings = SettingsContext.get();
	const noti = NotificationContext.get();

	onMount(async () => {
		const key = 'show-v1-site-construction-noti';
		if (!dev && localStorage.getItem(key) !== 'false') {
			const pushed = noti.stack.push('custom', {
				component: V1SiteConstruction,
				timeout: 10_000,
			});
			const notAgain = await pushed.resolution;
			if (notAgain) {
				localStorage.setItem(key, 'false');
			}
		}

		(await import('$lib/easter/ascii-pho')).default();
	});
</script>

<svelte:document use:lockscroll={settings.scrolllock} />

{#await navigating.complete}
	<PageLoadIndicator />
{/await}

<Header data-pagefind-ignore />
{@render children()}
{#if page.data.editUrl}
	<PageEditLink class="mt-auto" href={page.data.editUrl} id="edit-this-page" data-pagefind-ignore />
{/if}
<Footer class={[!page.data.editUrl && 'mt-auto']} {version} data-pagefind-ignore />
