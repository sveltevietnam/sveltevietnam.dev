```svelte
<script>
  /// :::diff -
  let data = generate();
  /// :::
  /// :::diff +
  let data = generate(options);
  /// :::
</script>

<!-- :::diff - -->
<div>{data}</div>
<!-- ::: -->
<!-- :::diff + -->
<p>{data}</p>
<!-- ::: -->

<style>
  /* :::diff - */
  div {
    /* ... */
  }
  /* ::: */
  /* :::diff + */
  p {
    /* ... */
  }
  /* ::: */
</style>
```