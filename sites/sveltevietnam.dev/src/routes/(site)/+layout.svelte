<script lang="ts">
	import { lockscroll } from '@svelte-put/lockscroll';
	import { onMount } from 'svelte';

	import { version } from '$app/environment';
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
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { children, data } = $props();

	const dialog = DialogContext.set();
	const settings = SettingsContext.set(page.data.sharedSettings);
	const noti = NotificationContext.set();

	$effect(() => {
		settings.language = page.data.sharedSettings.language;
	});

	onMount(async () => {
		(await import('$lib/easter/ascii-pho')).default();
	});
</script>

<svelte:document use:lockscroll={settings.scrolllock} />

{#await navigating.complete}
	<PageLoadIndicator />
{/await}

<Header
	locale={data.locales.header}
	localeLanguageMenu={data.locales.languageMenu}
	localeColorSchemeMenu={data.locales.colorSchemeMenu}
	localePageMenu={data.locales.pageMenu}
/>
{@render children()}
{#if page.data.editUrl}
	<PageEditLink class="mt-auto" href={page.data.editUrl} locale={data.locales.edit} />
{/if}
<Footer
	class={[!page.data.editUrl && 'mt-auto']}
	{version}
	locale={data.locales.footer}
	localeGreenWebBadge={data.locales.greenWebBadge}
	localeNotByAiBadge={data.locales.notByAiBadge}
/>

<DialogPortal stack={dialog} />
<NotificationPortal stack={noti.stack} />

{#if data.splash !== 'disabled'}
	<SplashScreen variant={data.splash} root />
{/if}
