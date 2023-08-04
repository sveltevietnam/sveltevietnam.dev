<script lang="ts">
  import { page } from '$app/stores';

  $: meta = $page.data.meta;

  $: langNotSupported = !$page.data.supportedLanguages.includes($page.data.language);
</script>

{#if langNotSupported}
  <p>Language is not supported.</p>
{/if}

<h1>{meta?.title}</h1>

<slot />
