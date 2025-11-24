```svelte title="+layout.svelte"
<script lang="ts">
  import { LoadingContext } from '$lib/loading.svelte.ts';
  import { navigating } from '$app/state';

  // :::highlight success
  const loading = LoadingContext.setGlobal(() => [navigating.complete]);
  // :::
</script>
```
