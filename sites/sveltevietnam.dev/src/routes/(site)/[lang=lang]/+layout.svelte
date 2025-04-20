<script lang="ts">
	import { lockscroll } from '@svelte-put/lockscroll';
	// import { LANGUAGES } from '@sveltevietnam/i18n';
	// import { localizeUrl } from '@sveltevietnam/i18n/utils';
	import { onMount, setContext } from 'svelte';

	import { version } from '$app/environment';
	// import { beforeNavigate, goto } from '$app/navigation';
	import { navigating, page } from '$app/state';
	import { Footer } from '$lib/components/footer';
	import { Header } from '$lib/components/header';
	import { PageEditLink } from '$lib/components/page-edit-link';
	import { PageLoadIndicator } from '$lib/components/page-load-indicator';
	import { SplashScreen } from '$lib/components/splash-screen';
	import DialogPortal from '$lib/dialogs/DialogPortal.svelte';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import NotificationPortal from '$lib/notifications/components/NotificationPortal.svelte';
	import { NotificationContext } from '$lib/notifications/context.svelte';
	import { RoutingContext } from '$lib/routing/context.svelte.js';
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
		(await import('$lib/easter/ascii-pho')).default();
	});

	/**
	 * If going from a localized url to a non-localized url,
	 * reroute to keep the lang segment. For example:
	 * navigate from `/en/blog` to `/events` will reroute to `/en/events`
	 */
	// beforeNavigate(({ to, cancel, from }) => {
	// 	const fromLang = from?.params?.lang;
	// 	const toLang = to?.params?.lang;
	// 	if (to && fromLang && !toLang) {
	// 		cancel();
	// 		const localized = localizeUrl(to.url, LANGUAGES, fromLang);
	// 		goto(localized);
	// 	}
	// });
</script>

<svelte:document use:lockscroll={settings.scrolllock} />

{#await navigating.complete}
	<PageLoadIndicator />
{/await}

<Header />
{@render children()}
{#if page.data.editUrl}
	<PageEditLink class="mt-auto" href={page.data.editUrl} />
{/if}
<Footer class={[!page.data.editUrl && 'mt-auto']} {version} />

<DialogPortal stack={dialog} />
<NotificationPortal stack={noti.stack} />

{#if data.splash !== 'disabled'}
	<SplashScreen variant={data.splash} root />
{/if}
