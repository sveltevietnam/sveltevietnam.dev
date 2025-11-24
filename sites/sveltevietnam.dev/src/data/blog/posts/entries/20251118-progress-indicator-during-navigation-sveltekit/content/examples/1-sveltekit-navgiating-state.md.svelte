```svelte title="+layout.svelte"
<script lang="ts">
  import { navigating } from '$app/state';
</script>

{#await navigating.complete}
  <LoadingBar />
{/await}
```
