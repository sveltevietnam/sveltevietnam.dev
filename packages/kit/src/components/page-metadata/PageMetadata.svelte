<script lang="ts">
	import { defu } from 'defu';

	import type { PageMetadata } from '@sveltevietnam/kit';

	import {
		buildStructuredBreadcrumbs,
		toStringWithContext,
	} from '../../utilities/structured-data/index.js';

	let { lang, metadata, defaults, origin, version, breadcrumbs }: import('.').PageMetadataProps =
		$props();

	/** SEO setup */
	let meta = $derived.by(() => {
		const {
			og: pageOg,
			twitter: pageTwitter,
			structured: pageStructured,
			...pageTopMetadata
		} = metadata ?? {};
		const {
			og: defaultOg,
			twitter: defaultTwitter,
			structured: defaultStructured,
			...defaultTopMetadata
		} = defaults ?? {};

		// merge OG data
		type OG = NonNullable<PageMetadata['og']>;
		const og = defu<OG, (OG | undefined)[]>(
			pageOg,
			{
				title: pageTopMetadata.title,
				description: pageTopMetadata.description,
				url: pageTopMetadata.canonical,
			},
			defaultOg,
		);
		if (og?.image?.src?.startsWith('/')) {
			og.image.src = `${origin}${og.image.src}`;
		}

		// merge Twitter data
		type Twitter = NonNullable<PageMetadata['twitter']>;
		const twitter = defu<Twitter, (Twitter | undefined)[]>(
			pageTwitter,
			{
				title: og.title,
				description: og.description,
				image: og.image,
			},
			defaultTwitter,
		);
		if (twitter?.image?.src?.startsWith('/')) {
			twitter.image.src = `${origin}${twitter.image.src}`;
		}

		// merge top metadata
		const top = defu(pageTopMetadata, defaultTopMetadata);

		let structured = pageStructured ?? defaultStructured;
		const things = !structured ? [] : Array.isArray(structured) ? structured : [structured];
		if (breadcrumbs && breadcrumbs.length > 1) {
			things.push(
				buildStructuredBreadcrumbs({
					lang,
					origin,
					items: breadcrumbs,
				}),
			);
		}

		return {
			...top,
			og,
			twitter,
			structured: things.length > 0 ? toStringWithContext(things) : undefined,
		};
	});
</script>

<svelte:head>
	<!-- basic tags -->
	{#if meta.title}
		<title>{meta.title}</title>
	{/if}

	{#if version}
		<meta name="version" content={version} />
	{/if}

	{#if meta.description}
		<meta name="description" content={meta.description} />
	{/if}

	{#if meta.keywords}
		<meta name="keywords" content={meta.keywords} />
	{/if}

	{#if meta.canonical}
		<link href={meta.canonical} rel="canonical" />
	{/if}

	{#if meta.paths}
		{#each Object.entries(meta.paths.alternate) as [lang, path] (lang)}
			{@const href = path.startsWith('/') ? `${origin}${path}` : path}
			<link rel="alternate" hreflang={lang} {href} />
		{/each}

		{@const href = meta.paths.default.startsWith('/')
			? `${origin}${meta.paths.default}`
			: meta.paths.default}
		<link rel="alternate" hreflang="x-default" {href} />
	{/if}

	<!-- OG tags -->
	{#if meta.og}
		{#if meta.og.type}
			<meta property="og:type" content={meta.og.type} />
		{/if}

		{#if meta.og.title}
			<meta property="og:title" content={meta.og.title} />
		{/if}

		{#if meta.og.description}
			<meta property="og:description" content={meta.og.description} />
		{/if}

		{#if meta.og.siteName}
			<meta property="og:site_name" content={meta.og.siteName} />
		{/if}

		{#if meta.og.url}
			<meta property="og:url" content={meta.og.url} />
		{/if}

		{#if meta.og.locale}
			<meta property="og:locale" content={meta.og.locale.current} />
			{#each meta.og.locale.alternate ?? [] as locale (locale)}
				<meta property="og:locale:alternate" content={locale} />
			{/each}
		{/if}

		{#if meta.og.image}
			{#if meta.og.image.src}
				<meta property="og:image" content={meta.og.image.src} />
			{/if}
			{#if meta.og.image.alt}
				<meta property="og:image:alt" content={meta.og.image.alt} />
			{/if}
			{#if meta.og.image.width}
				<meta property="og:image:width" content={meta.og.image.width.toString()} />
			{/if}
			{#if meta.og.image.height}
				<meta property="og:image:height" content={meta.og.image.height.toString()} />
			{/if}
			{#if meta.og.image.type}
				<meta property="og:image:type" content={meta.og.image.type} />
			{/if}
		{/if}
	{/if}

	{#if meta.twitter}
		{#if meta.twitter.title}
			<meta name="twitter:title" content={meta.twitter.title} />
		{/if}
		{#if meta.twitter.description}
			<meta name="twitter:description" content={meta.twitter.description} />
		{/if}
		{#if meta.twitter.card}
			<meta name="twitter:card" content={meta.twitter.card} />
		{/if}
		{#if meta.twitter.image}
			{#if meta.twitter.image.src}
				<meta name="twitter:image" content={meta.twitter.image.src} />
			{/if}
			{#if meta.twitter.image.alt}
				<meta name="twitter:image:alt" content={meta.twitter.image.alt} />
			{/if}
		{/if}
		{#if meta.twitter.site}
			<meta name="twitter:site" content={meta.twitter.site} />
		{/if}
		{#if meta.twitter.creator}
			<meta name="twitter:creator" content={meta.twitter.creator} />
		{/if}
	{/if}

	<!-- structured data in ld+json -->
	{#if meta?.structured}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -->
		{@html '<' + `script type="application/ld+json">${meta.structured}</script` + '>'}
	{/if}
</svelte:head>
