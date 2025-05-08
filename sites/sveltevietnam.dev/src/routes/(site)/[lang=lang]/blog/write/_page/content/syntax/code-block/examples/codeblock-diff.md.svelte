```svelte title="diff.svelte"
<script>
  // :::diff -
  import ComponentOld from './old.svelte';
  // :::
  // :::diff +
  import ComponentNew from './new.svelte';
  // :::
</script>

<!-- :::diff - -->
<ComponentOld>...</ComponentOld>
<!-- ::: -->
<!-- :::diff + -->
<ComponentNew>...</ComponentNew>
<!-- ::: -->
```
