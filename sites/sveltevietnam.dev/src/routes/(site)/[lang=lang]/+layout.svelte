<script lang="ts">
	import { lockscroll } from '@svelte-put/lockscroll';
	import { onMount, setContext } from 'svelte';

	import { dev, version } from '$app/environment';
	import { navigating, page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import { Footer } from '$lib/components/footer';
	import { Header } from '$lib/components/header';
	import { PageEditLink } from '$lib/components/page-edit-link';
	import { PageLoadIndicator } from '$lib/components/page-load-indicator';
	import DialogPortal from '$lib/dialogs/DialogPortal.svelte';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import NotificationPortal from '$lib/notifications/components/NotificationPortal.svelte';
	import { V1SiteConstruction } from '$lib/notifications/components/v1-site-construction';
	import { NotificationContext } from '$lib/notifications/context.svelte';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { children, data } = $props();

	const routing = RoutingContext.set(page.data.routing);
	$effect(() => {
		routing.update(page.data.routing);
	});

	const settings = SettingsContext.set(data.settings);
	$effect(() => {
		// FIXME: find mechanism that can do this within context itself
		settings.language = data.settings.language;
	});

	const dialog = DialogContext.set();
	const noti = NotificationContext.set();

	// for @sveltevietnam/i18n T.svelte component
	// TODO: create some abstraction around this
	setContext('t:lang', () => data.settings.language);

	onMount(async () => {
		if (
			settings.splashed &&
			settings.hydrated &&
			settings.hydrated.getTime() - settings.splashed.getTime() > 2000
		) {
			noti.toaster.info({
				title: m['notifications.delayed_hydration.title'],
				message: m['notifications.delayed_hydration.message'],
			});
		}

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

<Header />
{@render children()}
{#if page.data.editUrl}
	<PageEditLink class="mt-auto" href={page.data.editUrl} id="edit-this-page" />
{/if}
<Footer class={[!page.data.editUrl && 'mt-auto']} {version} />

<DialogPortal stack={dialog} />
<NotificationPortal stack={noti.stack} />
