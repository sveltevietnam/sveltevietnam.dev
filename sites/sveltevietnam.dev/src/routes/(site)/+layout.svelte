<script lang="ts">
	import { version } from '$app/environment';
	import { page } from '$app/state';
	import ogImageHome from '$lib/assets/images/og-fallback.jpg?url';
	// import { Footer } from '$lib/components/footer';
	import { Header } from '$lib/components/header';
	import { toStringWithContext, buildStructuredBreadcrumbs } from '$lib/meta/structured';
	import { RoutingContext } from '$lib/routing/context.svelte.js';
	import { SettingsContext } from '$lib/settings/context.svelte';
	import '$lib/styles/app.css';

	let { children, data } = $props();

	/** SEO setup */
	const DEFAULT_KEYWORDS = {
		en: 'svelte, vietnam, community, technology, open-source',
		vi: 'svelte, việt nam, cộng đồng, công nghệ, mã nguồn mở',
	};

	let meta = $derived.by(() => {
		const meta = page.data.meta;
		const title = meta?.title ?? 'Svelte Vietnam';
		const description =
			meta?.description ??
			'Inclusive community and go-to information hub for people of Svelte in Vietnam';
		const keywords = meta?.keywords ?? DEFAULT_KEYWORDS[page.data.sharedSettings.language];
		const canonical = meta?.canonical ?? page.url.toString();
		const rootRelativeOgImage = meta?.og?.image ?? ogImageHome;

		// structured data
		const things = !meta?.structured
			? []
			: Array.isArray(meta.structured)
				? meta.structured
				: [meta.structured];
		if (page.data.routing.breadcrumbs.length > 1) {
			things.push(buildStructuredBreadcrumbs(page.url.origin, page.data.routing.breadcrumbs));
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

	const settings = SettingsContext.set(page.data.sharedSettings);
	const routing = RoutingContext.set(page.data.routing);

	$effect(() => {
		routing.update(page.data.routing);
	});

	$effect(() => {
		settings.language = page.data.sharedSettings.language;
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
		{@html `<script type="application/ld+json">${meta.structured + '<'}/script>`}
	{/if}

	<!-- alternative localized links -->
	{#each Object.entries(routing.paths) as [lang, route]}
		<link rel="alternate" hreflang={lang} href="{page.url.origin}{route.path}" />
	{/each}
	<link rel="alternate" hreflang="x-default" href="{page.url.origin}{routing.paths.vi.path}" />
</svelte:head>

<Header locale={data.locales.header} localeLanguageMenu={data.locales.languageMenu} />
{@render children()}
<!-- <Footer locale={data.locales.footer} /> -->
