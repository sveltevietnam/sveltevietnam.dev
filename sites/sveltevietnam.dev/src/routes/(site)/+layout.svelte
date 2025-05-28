<script lang="ts">
	import { onMount, setContext } from 'svelte';

	import { version } from '$app/environment';
	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import {
		VITE_PUBLIC_ORIGIN,
		VITE_PUBLIC_UMAMI,
		VITE_PUBLIC_UMAMI_WEBSITE_ID,
		VITE_PUBLIC_UMAMI_SCRIPT_URL,
	} from '$env/static/public';
	import ogImageEn from '$lib/assets/images/fallbacks/og.en.jpg?url';
	import ogImageVi from '$lib/assets/images/fallbacks/og.vi.jpg?url';
	import DialogPortal from '$lib/dialogs/DialogPortal.svelte';
	import { DialogContext } from '$lib/dialogs/context.svelte';
	import { buildStructuredBreadcrumbs } from '$lib/meta/structured/breadcrumbs';
	import { toStringWithContext } from '$lib/meta/structured/utils';
	import NotificationPortal from '$lib/notifications/components/NotificationPortal.svelte';
	import { NotificationContext } from '$lib/notifications/context.svelte';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	let { children, data } = $props();

	const ogImage = {
		en: ogImageEn,
		vi: ogImageVi,
	};

	const routing = RoutingContext.set(page.data.routing);
	$effect(() => {
		routing.update(page.data.routing);
	});
	const dialog = DialogContext.set();
	const noti = NotificationContext.set();
	const settings = SettingsContext.set(data.settings);

	// for @sveltevietnam/i18n T.svelte component
	// TODO: create some abstraction around this
	setContext('t:lang', () => data.settings.language);

	$effect(() => {
		// FIXME: find mechanism that can do this within context itself
		settings.language = data.settings.language;
	});

	/** SEO setup */
	let meta = $derived.by(() => {
		const lang = data.settings.language;
		const meta = page.data.meta;
		const title = meta?.title ?? m['svelte_vietnam.name'](lang);
		const description = meta?.description ?? m['pages.home.desc'](lang);
		const keywords = meta?.keywords ?? m['pages.home.keywords'](lang);
		const canonical = meta?.canonical ?? page.url.toString();
		const rootRelativeOgImage = meta?.og?.image ?? ogImage[lang];

		// structured data
		const things = !meta?.structured
			? []
			: Array.isArray(meta.structured)
				? meta.structured
				: [meta.structured];
		const { breadcrumbs } = page.data.routing ?? {};
		if (breadcrumbs && breadcrumbs?.length > 1) {
			things.push(buildStructuredBreadcrumbs(lang, VITE_PUBLIC_ORIGIN, breadcrumbs));
		}
		const structured = things.length > 0 ? toStringWithContext(things) : undefined;

		const og = {
			title: meta?.og?.title ?? title,
			site_name: meta?.og?.site_name,
			description: meta?.og?.description ?? description,
			type: meta?.og?.type ?? 'website',
			url: meta?.og?.url ?? canonical,
			image: rootRelativeOgImage.startsWith('/')
				? `${page.url.origin}${rootRelativeOgImage}`
				: rootRelativeOgImage,
			imageAlt: meta?.og?.imageAlt ?? title,
		};

		const twitter = {
			title: meta?.twitter?.title ?? og.title,
			description: meta?.twitter?.description ?? og.description,
			image: meta?.twitter?.image ?? og.image,
			imageAlt: meta?.twitter?.imageAlt ?? og.imageAlt,
			card: meta?.twitter?.card ?? 'summary_large_image',
			site: meta?.twitter?.site ?? '@sveltevietnam',
			creator: meta?.twitter?.creator ?? '@sveltevietnam',
		};

		return {
			title,
			description,
			keywords,
			canonical,
			og,
			twitter,
			structured,
		};
	});

	function handleUmamiLoad() {
		window.umami?.identify({
			language: settings.language,
			systemColorScheme: settings.colorScheme.system,
			userColorScheme: settings.colorScheme.user,
			splash: settings.splash,
		});
	}

	onMount(() => {
		if (
			settings.splashed &&
			settings.hydrated &&
			settings.hydrated.getTime() - settings.splashed.getTime() > 2000
		) {
			if (window.umami) {
				window.umami.track('Delayed Hydration', {
					delta: settings.hydrated.getTime() - settings.splashed.getTime(),
				});
			}
			noti.toaster.info({
				title: m['notifications.delayed_hydration.title'],
				message: m['notifications.delayed_hydration.message'],
			});
		}
	});
</script>

<svelte:head>
	<!-- SEO meta tags -->
	<title>{meta.title}</title>
	<meta name="version" content={version} />
	<meta name="description" content={meta.description} />
	<meta name="keywords" content={meta.keywords} />

	<meta property="og:type" content={meta.og.type} />
	<meta property="og:title" content={meta.og.title} />
	<meta property="og:description" content={meta.og.description} />
	<meta property="og:locale" content="en_US" />
	<meta property="og:image" content={meta.og.image} />
	<meta property="og:image:alt" content={meta.og.imageAlt} />
	<meta property="og:image:width" content="1200" />
	<meta property="og:image:height" content="630" />
	<meta property="og:image:type" content="image/jpeg" />
	{#if meta?.og.site_name}
		<meta property="og:site_name" content={meta.og.site_name} />
	{/if}
	{#if meta?.og.url}
		<meta property="og:url" content={meta.og.url} />
	{/if}

	<meta name="twitter:title" content={meta.twitter.title} />
	<meta name="twitter:description" content={meta.twitter.description} />
	<meta name="twitter:card" content={meta.twitter.card} />
	<meta name="twitter:image" content={meta.twitter.image} />
	<meta name="twitter:image:alt" content={meta.twitter.imageAlt} />
	<meta name="twitter:site" content={meta.twitter.site} />
	<meta name="twitter:creator" content={meta.twitter.creator} />

	{#if meta.canonical}
		<link href={meta.canonical} rel="canonical" />
	{/if}

	<!-- structured data in ld+json -->
	{#if meta?.structured}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html '<' + `script type="application/ld+json">${meta.structured}</script` + '>'}
	{/if}

	<!-- alternative localized links -->
	{#if page.data.routing}
		{#each Object.entries(page.data.routing.paths) as [lang, path] (lang)}
			<link rel="alternate" hreflang={lang} href="{VITE_PUBLIC_ORIGIN}{path}" />
		{/each}
		<link
			rel="alternate"
			hreflang="x-default"
			href="{VITE_PUBLIC_ORIGIN}{page.data.routing.paths.vi}"
		/>
	{/if}

	{#if VITE_PUBLIC_UMAMI !== '0' && VITE_PUBLIC_UMAMI !== 'false'}
		<script
			defer
			onload={handleUmamiLoad}
			src={VITE_PUBLIC_UMAMI_SCRIPT_URL}
			data-website-id={VITE_PUBLIC_UMAMI_WEBSITE_ID}
		></script>
	{/if}
</svelte:head>

{@render children()}

<DialogPortal stack={dialog} />
<NotificationPortal stack={noti.stack} />
