```svelte title="subscribe.form.svelte"
<script lang="ts">
  import { LoadingContext } from '$lib/loading.svelte.ts';
  import { subsribe } from './subscribe.remote.ts'
  // :::highlight
  const loading = LoadingContext.getGlobal();
  // :::
</script>

<form {...subscribe.enhance(async ({ submit }) => {
  // :::focus
  // :::highlight
  const unload = loading.load();
  try {
    await submit();
  } finally {
    unload();
  }
  // :::
  // :::
})}>
  ...
</form>
```
