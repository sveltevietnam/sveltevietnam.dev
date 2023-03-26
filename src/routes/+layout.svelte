<script lang="ts">
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  import { partytownSnippet } from '@builder.io/partytown/integration';
  import { onMount } from 'svelte';

  import { dev, browser } from '$app/environment';
  import { page } from '$app/stores';
  import { PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID } from '$env/static/public';
  import { localizeUrl, LANGUAGES } from '$shared/services/i18n';

  import '../lib/client/styles/app.css';

  $: meta = $page.data.meta;

  $: title = meta?.title ?? 'Svelte Vietnam';
  $: description =
    meta?.description ?? 'Community and go-to information hub for people of Svelte in Vietnam';
  $: keywords = meta?.keywords ?? ['svelte', 'vietnam'];

  $: ogTitle = meta?.og?.title ?? title;
  $: ogDescription = meta?.og?.description ?? description;
  $: ogType = meta?.og?.type ?? 'website';
  $: ogUrl = meta?.og?.url ?? `${$page.url.origin}${$page.url.pathname}`;
  $: ogImage = meta?.og?.image ?? `${$page.url.origin}/images/og.png`;
  $: ogImageAlt = meta?.og?.imageAlt ?? title;

  $: twitterTitle = meta?.twitter?.title ?? ogTitle;
  $: twitterDescription = meta?.twitter?.description ?? ogDescription;
  $: twitterCard = meta?.twitter?.card ?? 'summary_large_image';
  $: twitterImage = meta?.twitter?.img ?? ogImage;
  $: twitterImageAlt = meta?.twitter?.imageAlt ?? title;
  $: twitterSite = meta?.twitter?.site ?? '@sveltevietnam';

  $: analyticsEnabled = !dev;

  let analyticsId = $page.data.vercelAnalyticsId;
  let webVitals: typeof import('$client/services/web-vitals').webVitals;
  $: if (browser && analyticsId && webVitals) {
    webVitals({
      path: $page.url.pathname,
      params: $page.params,
      analyticsId,
    });
  }
  $: if (browser && gtag && analyticsEnabled) {
    gtag('config', PUBLIC_GOOGLE_ANALYTICS_MEASUREMENT_ID, {
      page_title: document.title,
      page_location: $page.url.href,
      page_path: $page.url.pathname,
    });
  }
  onMount(async () => {
    webVitals = (await import('$client/services/web-vitals')).webVitals;
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

  <link href={ogUrl} rel="canonical" />
  <link type="text/plain" rel="author" href="{$page.url.origin}/humans.txt" />

  <!-- alternative localized links -->
  {#each LANGUAGES.filter((l) => l !== $page.data.language) as lang}
    <link rel="alternate" hreflang={lang} href={localizeUrl($page.url, lang).toString()} />
  {/each}
  <link rel="alternate" hreflang="x-default" href={localizeUrl($page.url, 'vi').toString()} />

  <!-- partytown scripts -->
  <!-- partytown scripts -->
  <!-- partytown scripts -->
  <script>
    partytown = {
      // forward the necessary functions to the web worker layer
      forward: ['gtag'],
    };
  </script>
  {@html `<script>${partytownSnippet()}</script>`}

  {#if analyticsEnabled}
    <!-- vercel analytics -->
    <!-- vercel analytics -->
    <!-- vercel analytics -->
    <script src="/_vercel/insights/script.js" type="text/partytown"></script>

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
