<script lang="ts">
  export let version: 'original' | 'positive' | 'negative' | 'themed' = 'original';
  export let width = 50;
  export let height = 56;
  let cls = '';
  export { cls as class };
</script>

<svg data-version={version} inline-src="sveltevietnam" {width} {height} class={cls} />

<style lang="postcss">
  svg {
    --logo-color-bg: white;
    --logo-color-fg: black;

    & :global(.fg) {
      fill: var(--logo-color-bg);
    }

    & :global(.bg) {
      fill: var(--logo-color-fg);
      transition: fill var(--transition-duration, 250ms)
        var(--transition-timing-function, ease-in-out);
    }

    &:where([data-version='original']) {
      --logo-color-bg: white;
      --logo-color-fg: theme('colors.svelte');
    }

    &:where([data-version='positive']) {
      --logo-color-bg: white;
      --logo-color-fg: black;
    }

    &:where([data-version='negative']) {
      --logo-color-bg: black;
      --logo-color-fg: white;
    }

    &:where([data-version='themed']) {
      --logo-color-bg: white;
      --logo-color-fg: black;

      @dark global {
        --logo-color-bg: black;
        --logo-color-fg: white;
      }
    }
  }
</style>
