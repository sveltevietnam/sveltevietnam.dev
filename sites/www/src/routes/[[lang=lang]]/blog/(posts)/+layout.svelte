<script lang="ts">
  import { page } from '$app/stores';
  import { Breadcrumbs } from '$client/components/Breadcrumbs';
  import type { Breadcrumb } from '$shared/services/navigation';

  import type { LayoutData } from './$types';

  export let data: LayoutData;

  $: meta = $page.data.meta;
  $: langNotSupported = !$page.data.supportedLanguages.includes($page.data.language);
  $: breadcrumbs = [...data.breadcrumbs, { label: meta?.title ?? '' }] satisfies Breadcrumb[];
</script>

<main class="c-container-design">
  <Breadcrumbs {breadcrumbs} />
  <article class="prose dark:prose-invert max-w-none prose-svelte-vn">
    {#if langNotSupported}
      <p>Language is not supported.</p>
    {/if}
    <h1>{meta?.title}</h1>
    <slot />
  </article>
</main>
