<script>
  import { writable } from 'svelte/store';

  const packageManager = writable('pnpm');
</script>

<enhanced-code-block group name="installation" display="tabs" bind:title={$packageManager}>

```bash
/// title=npm
npm install --save-dev tailwindcss postcss @sveltevietnam/ui
```

```bash
/// title=pnpm
/// hideLineNumber=true
pnpm add -D tailwindcss postcss @sveltevietnam/ui
# something else to admire
```

```bash
/// title=yarn
yarn add -D tailwindcss postcss @sveltevietnam/ui
```

</enhanced-code-block>