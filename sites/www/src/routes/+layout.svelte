<script lang="ts">
	import { localizeUrl } from '@internals/utils/url';

	import { page } from '$app/stores';
	import { PUBLIC_MODE } from '$env/static/public';
	import ogImageHome from '$shared/assets/images/og/og-home.jpg';
	import { LANGUAGES } from '$shared/services/i18n';

	import '../lib/client/styles/app.css';

	const DEFAULT_KEYWORDS = ['svelte', 'vietnam'];

	$: meta = $page.data.meta;

	$: title = meta?.title ?? 'Svelte Vietnam';
	$: description =
		meta?.description ?? 'Community and go-to information hub for people of Svelte in Vietnam';
	$: keywords = meta?.keywords ? [...DEFAULT_KEYWORDS, ...meta.keywords] : DEFAULT_KEYWORDS;
	$: canonical = meta?.canonical ?? `${$page.url.origin}${$page.url.pathname}`;

	$: ogTitle = meta?.og?.title ?? title;
	$: ogDescription = meta?.og?.description ?? description;
	$: ogType = meta?.og?.type ?? 'website';
	$: ogUrl = meta?.og?.url ?? canonical;
	$: ogImage = meta?.og?.image ?? ogImageHome;
	$: absoluteOgImage = ogImage.startsWith('/') ? `${$page.url.origin}${ogImage}` : ogImage;
	$: ogImageAlt = meta?.og?.imageAlt ?? title;

	$: twitterTitle = meta?.twitter?.title ?? ogTitle;
	$: twitterDescription = meta?.twitter?.description ?? ogDescription;
	$: twitterImage = meta?.twitter?.image ?? absoluteOgImage;
	$: twitterImageAlt = meta?.twitter?.imageAlt ?? ogImageAlt;
	$: twitterCard = meta?.twitter?.card ?? 'summary_large_image';
	$: twitterSite = meta?.twitter?.site ?? '@sveltevietnam';
	$: twitterCreator = meta?.twitter?.creator ?? '@sveltevietnam';
</script>

<svelte:head>
	<!-- SEO meta tags -->
	<title>{title}</title>
	<meta name="description" content={description} />
	<meta name="keywords" content={keywords.join(', ')} />

	<meta property="og:title" content={ogTitle} />
	<meta property="og:description" content={ogDescription} />
	<meta property="og:type" content={ogType} />
	<meta property="og:image" content={absoluteOgImage} />
	<meta property="og:image:alt" content={ogImageAlt} />
	<meta property="og:url" content={ogUrl} />

	<meta name="twitter:title" content={twitterTitle} />
	<meta name="twitter:description" content={twitterDescription} />
	<meta name="twitter:card" content={twitterCard} />
	<meta name="twitter:image" content={twitterImage} />
	<meta name="twitter:image:alt" content={twitterImageAlt} />
	<meta name="twitter:site" content={twitterSite} />
	<meta name="twitter:creator" content={twitterCreator} />

	<link href={canonical} rel="canonical" />
	<link type="text/plain" rel="author" href="{$page.url.origin}/humans.txt" />

	<!-- alternative localized links -->
	{#each LANGUAGES as lang}
		<link
			rel="alternate"
			hreflang={lang}
			href={localizeUrl($page.url, lang, LANGUAGES).toString()}
		/>
	{/each}
	<link
		rel="alternate"
		hreflang="x-default"
		href={localizeUrl($page.url, 'vi', LANGUAGES).toString()}
	/>

	<meta name="mode" content={PUBLIC_MODE} />
</svelte:head>

<slot />
