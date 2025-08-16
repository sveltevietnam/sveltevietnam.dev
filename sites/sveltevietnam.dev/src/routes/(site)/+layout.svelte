<script lang="ts">
	import { PageMetadata } from '@sveltevietnam/kit/components';
	import { ColorSchemeContext, RoutingContext } from '@sveltevietnam/kit/contexts';
	import { onMount, setContext } from 'svelte';

	import { browser, dev, version } from '$app/environment';
	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import {
		VITE_PUBLIC_ORIGIN,
		VITE_PUBLIC_UMAMI,
		VITE_PUBLIC_UMAMI_WEBSITE_ID,
		VITE_PUBLIC_UMAMI_SCRIPT_URL,
		VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
	} from '$env/static/public';
	import ogImageEn from '$lib/assets/images/fallbacks/og.en.jpg?url';
	import ogImageVi from '$lib/assets/images/fallbacks/og.vi.jpg?url';
	import DialogPortal from '$lib/dialogs/components/DialogPortal.svelte';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import NotificationPortal from '$lib/notifications/components/NotificationPortal.svelte';
	import { NotificationContext } from '$lib/notifications/context.svelte';
	import { SearchContext } from '$lib/search/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { LayoutProps } from './$types';

	let { children, data }: LayoutProps = $props();

	const ogImage = {
		en: ogImageEn,
		vi: ogImageVi,
	};

	const routing = RoutingContext.set(() => ({
		lang: data.settings.language,
		paths: page.data.routing?.paths ?? {
			en: page.url.pathname,
			vi: page.url.pathname,
		},
	}));
	const dialog = DialogContext.set();
	const noti = NotificationContext.set();
	const settings = SettingsContext.set(data.settings);
	const colorScheme = ColorSchemeContext.set(() => ({
		cookieName: VITE_PUBLIC_COOKIE_NAME_COLOR_SCHEME,
		user: data.settings.colorScheme,
	}));
	SearchContext.set(page.url.origin);

	// for @sveltevietnam/i18n T.svelte component
	setContext('t:lang', () => data.settings.language);

	function callUmamiIdentify() {
		window.umami?.identify({
			language: routing.lang,
			systemColorScheme: colorScheme.system,
			userColorScheme: colorScheme.user,
			splash: settings.splash,
		});
	}

	function trackSearch(event: CustomEvent<{ query: string }>) {
		window.umami?.track(event.type, {
			query: event.detail.query,
		});
	}

	onMount(() => {
		if (window.umami) {
			callUmamiIdentify();
		} else {
			document.getElementById('umami-script')?.addEventListener('load', callUmamiIdentify);
		}

		if (
			!dev &&
			settings.splashed &&
			settings.hydrated &&
			settings.hydrated.getTime() - settings.splashed.getTime() > 2000
		) {
			if (window.umami) {
				window.umami.track('delayed-hydration', {
					delta: settings.hydrated.getTime() - settings.splashed.getTime(),
				});
			}
			noti.toaster.info({
				title: m['notifications.delayed_hydration.title'],
				message: m['notifications.delayed_hydration.message'],
			});
		}

		// Listen for search events
		window.addEventListener('searchopen', trackSearch as EventListener);
		window.addEventListener('searchclose', trackSearch as EventListener);

		return () => {
			window.removeEventListener('searchopen', trackSearch as EventListener);
			window.removeEventListener('searchclose', trackSearch as EventListener);
		};
	});
</script>

<PageMetadata
	lang={routing.lang}
	origin={page.url.origin}
	breadcrumbs={page.data.routing?.breadcrumbs}
	{version}
	metadata={{
		...page.data.meta,
		...(page.data.routing && {
			paths: {
				default: VITE_PUBLIC_ORIGIN + page.data.routing.paths[routing.lang],
				alternate: {
					vi: VITE_PUBLIC_ORIGIN + page.data.routing.paths.vi,
					en: VITE_PUBLIC_ORIGIN + page.data.routing.paths.en,
				},
			},
		}),
	}}
	defaults={{
		title: m['svelte_vietnam.name'](routing.lang).toString(),
		description: m['pages.home.desc'](routing.lang).toString(),
		keywords: m['pages.home.keywords'](routing.lang).toString(),
		canonical: page.url.origin + page.url.pathname,
		og: {
			type: 'website',
			siteName: m['svelte_vietnam.name'](routing.lang).toString(),
			image: {
				src: page.url.origin + ogImage[routing.lang],
				alt: m['svelte_vietnam.name'](routing.lang).toString(),
				width: 1200,
				height: 630,
				type: 'image/jpeg',
			},
		},
		twitter: {
			card: 'summary_large_image',
			site: '@sveltevietnam',
			creator: '@sveltevietnam',
		},
	}}
/>

<svelte:head>
	{#if VITE_PUBLIC_UMAMI !== '0' && VITE_PUBLIC_UMAMI !== 'false' && !browser}
		<script
			id="umami-script"
			defer
			src={VITE_PUBLIC_UMAMI_SCRIPT_URL}
			data-website-id={VITE_PUBLIC_UMAMI_WEBSITE_ID}
		></script>
	{/if}
</svelte:head>

{@render children()}

<DialogPortal stack={dialog} />
<NotificationPortal stack={noti.stack} />
