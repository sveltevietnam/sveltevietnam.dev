<script lang="ts">
  import type { PageData } from './$types';
  export let data: PageData;

  $: t = data.translations.page;
</script>

<main>
  <h1>Page Skeleton</h1>
</main>
