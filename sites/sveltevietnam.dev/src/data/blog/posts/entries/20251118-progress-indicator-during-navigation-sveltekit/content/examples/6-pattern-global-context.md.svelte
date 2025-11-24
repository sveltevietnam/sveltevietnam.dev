```svelte title="+layout.svelte"
<script lang="ts">
  import { LoadingContext } from '$lib/loading.svelte.ts';
  import { navigating } from '$app/state';

  // This WON'T work as expected
  // :::highlight error
  const loading = LoadingContext.setGlobal([navigating.complete]);
  // :::
</script>
```
