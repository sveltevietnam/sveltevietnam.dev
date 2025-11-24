```svelte title="+layout.svelte"
<script lang="ts">
  import { navigating } from '$app/state';
  // :::diff +
  import { LoadingContext } from '$lib/loading.svelte.ts';
  const loading = LoadingContext.setGlobal(() => [navigating.complete]);
  // :::
</script>

<!-- :::diff - -->
{#await navigating.complete}
<!-- ::: -->
<!-- :::diff + -->
{#await loading.done}
<!-- ::: -->
  <LoadingBar />
{/await}
```
