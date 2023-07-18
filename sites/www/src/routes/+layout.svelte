<script lang="ts">
  import { partytownSnippet } from '@builder.io/partytown/integration';
  import { onMount } from 'svelte';

  import { dev, browser } from '$app/environment';
  import { page } from '$app/stores';
  import { PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID } from '$env/static/public';
  import { localizeUrl, LANGUAGES } from '$shared/services/i18n';

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
  $: ogImage = meta?.og?.image ?? `${$page.url.origin}/images/og/home.webp`;
  $: ogImageAlt = meta?.og?.imageAlt ?? title;

  $: twitterTitle = meta?.twitter?.title ?? ogTitle;
  $: twitterDescription = meta?.twitter?.description ?? ogDescription;
  $: twitterImage = meta?.twitter?.image ?? ogImage;
  $: twitterImageAlt = meta?.twitter?.imageAlt ?? ogImageAlt;
  $: twitterCard = meta?.twitter?.card ?? 'summary_large_image';
  $: twitterSite = meta?.twitter?.site ?? '@sveltevietnam';
  $: twitterCreator = meta?.twitter?.creator ?? '@sveltevietnam';

  $: analyticsEnabled = !dev;

  $: if (browser && !analyticsEnabled && PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID && gtag) {
    gtag('config', PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: $page.url.href,
      page_path: $page.url.pathname,
    });
  }

  onMount(() => {
    // const ws = new WebSocket('ws://localhost:5006/websocket');
    // ws.addEventListener('message', (event) => {
    //   const data = JSON.parse(event.data);
    //   console.log(data);
    // });
    // return () => {
    //   ws.close();
    // };
  });
</script>

<svelte:head>
  <!-- SEO meta tags -->
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords.join(', ')} />

  <meta property="og:title" content={ogTitle} />
  <meta property="og:description" content={ogDescription} />
  <meta property="og:type" content={ogType} />
  <meta property="og:image" content={ogImage} />
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
  {#each LANGUAGES.filter((l) => l !== $page.data.language) as lang}
    <link rel="alternate" hreflang={lang} href={localizeUrl($page.url, lang).toString()} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={localizeUrl($page.url, 'vi').toString()} />

  <script>
    // partytown scripts
    partytown = {
      // forward the necessary functions to the web worker layer
      forward: ['gtag'],
    };
  </script>
  {@html '<script>' + partytownSnippet() + '</script>'}

  {#if analyticsEnabled}
    <!-- Google tag (gtag.js) -->
    {@html `<script type="text/partytown" async src="https://www.googletagmanager.com/gtag/js?id="${PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID}"></script>`}
    <script type="text/partytown">
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () {
        dataLayer.push(arguments);
      };
      gtag('js', new Date());
    </script>
  {/if}
</svelte:head>

<slot />
