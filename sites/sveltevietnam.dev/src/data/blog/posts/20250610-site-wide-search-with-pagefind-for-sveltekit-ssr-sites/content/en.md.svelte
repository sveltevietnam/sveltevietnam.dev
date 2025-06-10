<script>
	import { SettingsContext } from '$lib/settings/context.svelte';
  import imgScreenshotSearchDialog from '../images/search-dialog-screenshot.en.png?format=avif&imagetools';

	const settings = SettingsContext.get();
</script>

If you are using a keyboard, try pressing the key combination
<span class="c-text-body-xs">
  {#if settings.platform === 'mac'}
    <kbd>⌘</kbd>
  {:else}
    <kbd>Ctrl</kbd>
  {/if}
  <kbd>K</kbd>
</span>
(or click on search box <i class="i i-[ph--magnifying-glass] w-5 h-5"></i> at the page header) to trigger the search dialog. This feature uses [Pagefind] under the hood to perform keyword search across the pages at sveltevietnam.dev.

<figure>
  <img src={imgScreenshotSearchDialog} class="w-full border border-outline" width="800" height="475" alt="" />
  <figcaption>Screenshot: search dialog with the "design" keyword</figcaption>
</figure>

This post introduces one solution to integrate Pagefind into SvelteKit projects in general, and specifically projects using SSR.

## Overview of Pagefind and Problem with SSR

At build time, Pagefind reads applicable pages, performs natural language processing on the page content, and builds out an index. When a user enters a search query, Pagefind uses that index to return the most relevant results.

For Pagefind to build said index, we need to provide it with HTML files via its [CLI](https://pagefind.app/docs/running-pagefind/) or [Node API][pagefind.node]. For example, the command as per Pagefind's documentation:

```bash
npx pagefind --site public
```

practically means "hey Pagefind, find and index all HTML files in the `public` directory". If you use [adapter-static](https://svelte.dev/docs/kit/adapter-static) or [prerender][sveltekit.prerender] all indexable pages, the corresponding HTML files will be generated during the build process, and all you need to do is run the command above with the appropriate directory.

However, for server-rendered pages, no HTML files are generated during the build process. This is the key problem that I'm attempting to solve here.

## Overview of the Solution for SSR

The following lists the procedure that I have successfully implemented to help Pagefind index SSR pages:

1. build the application (`vite build` or similar command),
2. run the preview server (`vite preview` or similar command),
3. request sitemap (`/sitemap.xml` or similar page) from the preview server to get a list of indexable pages,
4. fetch the SSR HTML from each page in the list from (3),
5. use the data from (3) and (4) as input, via [Node API][pagefind.node], to create an index for
   Pagefind.

To automate this process and ensure consistency without trading off developer ergonomics, I have abstracted it into a [Vite plugin](https://vite.dev/guide/using-plugins).

<div class="c-callout c-callout--info">

Perhaps you find writing a Vite plugin unnecessarily complex compared to a regular NodeJS script, but this is in fact the ideal use case for a Vite plugin, as these tasks are tightly coupled with the dev/build processes, which are already managed by Vite.

Getting myself familiar with the tooling that Vite provides has helped me problem-solve many issues in my work. Vite's convenient and mature API is also the reason why the whole ecosystem seems to be converging towards it — Svelte and SvelteKit themselves are essentially just Vite plugins. If this is new to you, I highly recommend exploring it further!

</div>

## Vite plugin

You can refer to the specific source code of the plugin mentioned [here](https://github.com/sveltevietnam/sveltevietnam.dev/blob/v1/sites/sveltevietnam.dev/src/lib/pagefind/vite.ts), or through the code snippet below (expand to view):

```ts title="pagefind/vite.ts" src="../../../../../lib/pagefind/vite.ts" collapsed
```

I won't go into too much details, but the following sections highlight some key points.

### Components

The solution consists of 2 plugins:

1. a plugin that runs during the dev process, creating an empty index to avoid errors due to missing Pagefind resources (script, index, etc.),
2. a plugin that runs during the build process, performing the steps outlined in the previous section, and updating the index for subsequent dev processes.

### Hook, Environment, and Order

Choosing the right [hook](https://vite.dev/guide/api-plugin.html#universal-hooks) and [Vite environment](https://vite.dev/guide/api-environment), as well as the order in which the plugins run, is crucial.

Specifically, the dev plugin needs to run before the dev server starts, and the build plugin needs to run after SvelteKit's build process is complete, but before built files are copied to the target directory as per instructed by the adapter being used (to avoid dependence on the adapter or project-specific customizations).

Additionally, at the time of writing, SvelteKit builds for two environments, `client` and `ssr`. We need to run the build plugin in the `ssr` environment to ensure that the application is ready to run on the preview server.

### NodeJS

Right now, my plugin relies on some NodeJS APIs, specifically `node:child_process` to run the preview server, and `node:fs`, `node:path`, and `node:process` to interact with the filesystem. These tasks need to be replaced to adapt to other runtimes like Deno or Bun.

For the same reason, your CI/CD will fail if you run it in a non-NodeJS environment — something to keep in mind if you want to apply a similar pattern to your project.

<div class="c-callout c-callout--success">

From my tests, this plugin runs fine in the Cloudflare build CI.

</div>

### Further Improvements

#### Single Page Application (SPA)

Theoretically, we can extend this idea to index pages from a Single Page Application (SPA) by using [puppeteer](https://pptr.dev/) or similar browser emulation tools.

#### Using with Other Adapters in SvelteKit

I haven't tested all the current adapters in the Svelte ecosystem, but I suspect that this solution will work with most of them. However, it may require some adjustments and potentially should provide more configuration for plugin users to adapt to their specific needs.

#### Should I package this into a library?

It's probably a good idea to make this into a library for better reusability. However, I haven't had the time to implement tests or harden the implementation enough to be confident for public use. If you think this is something I should do, please let me know!

## Importing Pagefind on Client Side

Another common issue with Pagefind in Vite projects is importing the generated script in browser. Pagefind is built as a collection of [static assets](https://vite.dev/guide/assets) — for example, the plugin above will likely place them in the `/static/pagefind` directory. Vite currently does not support importing JS from this directory:

```js title="search.js"
// :::highlight error
import pagefind from '/pagefind/pagefind.js';
// :::
// Error:
// Cannot import non-asset file /pagefind/pagefind.js which is inside /public.
// JS/CSS files inside /public are copied as-is on build and can only be referenced
// via <script src> or <link href> in html. If you want to get the URL of that file,
// use /pagefind/pagefind.js?url instead
```

There are existing solutions to this issue, but after trying several approaches, I decided to just go with what I think is the simplest thus far:

```svelte title="search.svelte"
<script>
  import { page } from '$app/state';
  import { onMount } from 'svelte';
  onMount(() => {
    // :::highlight
    // :::focus
    import(/* @vite-ignore */ `${origin}/pagefind/pagefind.js`).then((pagefind) => {
    // :::
    // :::
      pagefind.init();
      pagefind.search({ /* ... */ });
    });
  });
</script>
```

Notice the use of [dynamic import](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/import). Additionally:

- `/* @vite-ignore */` is a directive to tell `vite:import-analysis` to skip analysis for this import,
- the `origin` prefix is necessary, otherwise I would still encounter the same error as above.

<div class="c-callout c-callout--warning c-callout--icon-question">

Does this open up any kind of security vulnerability? I don't think so, but let me know if you think otherwise.

</div>

## Typescript Support

At the time of writing, there is no official guide to support TypeScript for Pagefind. However, you
can simply add a file `src/pagefind.d.ts` to your project with the following content:

```ts title="src/pagefind.d.ts" src="../../../../../pagefind.d.ts"
```

Then start using the appropriate types via `import('@pagefind')`:

```ts title="search.svelte"
<script lang="ts">
  // ...
  onMount(() => {
    // :::highlight
    // :::focus
    import(/* @vite-ignore */ `${origin}/pagefind/pagefind.js`).then((pagefind: import('@pagefind').default) => {
    //:::
    //:::
      // ...
    });
  });
</script>
```

## Closing

In this post I have briefly introduced how to integrate Pagefind into SvelteKit projects, including ones using SSR. I hope the presented information will prove useful in your work with Svelte. If you have any feedback or questions, you can find me at [vnphanquang on Bluesky](https://bsky.app/profile/vnphanquang.com) or at the [Svelte Vietnam Discord](https://discord.sveltevietnam.dev).

Thank you for reading!

[pagefind]: https://pagefind.app
[pagefind.node]: https://pagefind.app/docs/node-api
[sveltekit.prerender]: https://svelte.dev/docs/kit/page-options#prerender
