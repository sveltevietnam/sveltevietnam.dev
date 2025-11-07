<script>
  import imgScreenshot from '../images/screenshot.png?format=avif&imagetools';
</script>

In the past, I often stuck to [Google Analytics](https://developers.google.com/analytics) due to its popularity, relative ease of integration, and feature set. However, Google is notorious for excessive user data collection and thus privacy concerns. Recently, I have been experimenting with [Umami], an open-source alternative that offers better data control for both developers and users.

Integrating Umami into a Svelte/SvelteKit project is quite straightforward. This article shares how I configured it and hopefully can give you a brief overview of Umami.

## Creating Account & Choosing Hosting Solution

Umami provides a [free plan](https://umami.is/pricing) via their cloud service, which includes basic features and decent limits. You can sign up for an account to try out. Additionally, Umami makes it easy for [self-hosting](https://umami.is/docs/guides/hosting), allowing installation on my server of choice with complete control over the collected data. You can refer to the [installation guide](https://umami.is/docs/install) for more details.

In my experiment, I chose to self-host using [Docker](https://www.docker.com/) on a homelab [Raspberry Pi](https://www.raspberrypi.com/), with the help of [Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/) for access control management. This is the most cost-effective solution I know of, but it requires basic knowledge of system administration and the Linux operating system (not too difficult though!). I won't go into details here to avoid being too verbose. Perhaps I'll share more in a future article.

<div class="c-callout c-callout--info c-callout--icon-question">

Collecting analytics is non-essential and (should) run in background, so if my personal server is not very powerful, or in the case of power outages, it won't affect user experience and the overall application health.

</div>

Expand the code block below to see my Docker configuration:

```yaml title="docker-compose.yaml" src="../examples/docker-compose.yaml" collapsed
```

## Integrating Umami into Svelte

Just add the right script tag to your application, as per the instructions at [Umami > Collect Data](https://umami.is/docs/collect-data):

```svelte title="+layout.svelte"
<svelte:head>
  <script defer src={...} data-website-id={...} ></script>
</svelte:head>
```

The above code can be placed almost anywhere in your application. If you're using SvelteKit, you can add it to the appropriate `+layout.svelte` file. Additionally, you can store the attributes' values via environment variables for easier management and context switching among different environments (development, staging, production, etc.). For example:

```svelte title="+layout.svelte"
{#if PUBLIC_UMAMI !== '0' && PUBLIC_UMAMI !== 'false'}
  <script
    defer
    src={PUBLIC_UMAMI_SCRIPT_URL}
    data-website-id={PUBLIC_UMAMI_WEBSITE_ID}
  ></script>
{/if}
```

That's it! From my experiment, Umami works seamlessly for both client-side and server-side navigation without the need for any additional intervention.

<figure>
  <img src={imgScreenshot} class="mx-auto max-w-full rounded" width="600" height="344" alt="" />
  <figcaption>Screenshot: User interface of Umami dashboard</figcaption>
</figure>

## Sending Session Properties

[Session properties](https://umami.is/docs/sessions) in Umami help you collect additional information about users, such as personal or system preferences. To add this information, you need to call the `umami.identify` function. Here's an example of how to do this in Svelte:

```svelte title="+layout.svelte"
<script>
	function handleUmamiLoad() {
		console.log('umami loaded');
		window.umami?.identify({
			language: settings.language,
			systemColorScheme: settings.colorScheme.system,
			userColorScheme: settings.colorScheme.user,
      // ...
		});
	}
</script>

<script onload={handleUmamiLoad} {...}></script>
```

Umami's script will add the `umami` object to the `window`, but we can't be sure when this script has finished loading. Listening for the `onload` event as shown above is one way to overcome this.

## Adding TypeScript Support

At the time of this writing, there is no official guide on how to add types for `window.umami`. Nevertheless, the following presents a way to do so today. First, install this package:

```bash
pnpm add -D @types/umami-browser
```

Next, add the following code to your global `.d.ts` file (usually `src/app.d.ts` or `src/global.d.ts`):

```typescript title="src/app.d.ts"
// :::diff +
/// <reference types="umami-browser" />
// :::
declare global {
  // :::diff +
  interface Window {
    umami?: umami.umami;
  }
  // :::
}
```

## Closing

That was pretty easy, right? If you have any feedback or want to discuss about this article, you can find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com) or via the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

Thank you for reading!

[umami]: https://umami.is/
