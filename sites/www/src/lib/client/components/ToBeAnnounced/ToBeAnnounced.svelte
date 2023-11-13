<script lang="ts">
  export let variant: 'text' | 'figure' = 'figure';
  let cls = '';
  export { cls as class };
</script>

{#if variant === 'text'}
  <div class="w-full border rounded-[16px] border-design-fg-1 pt-20 pb-14 {cls}">
    <svg inline-src="tba" width="323" height="94" class="mx-auto max-w-full" />
    <div class="mt-10">
      <slot />
    </div>
  </div>
{:else if variant === 'figure'}
  <div
    class="{cls} w-full border rounded-[16px] border-design-border-1 p-8 flex flex-col items-center justify-center"
  >
    <svg inline-src="./tba-figure.svg" class="m-auto max-w-full w-[357px]" />
    <div class="mt-6">
      <slot />
    </div>
  </div>
{/if}

<style lang="postcss">
  svg :global(.__megaphone) {
    @light global {
      fill: black;
    }
  }
</style>
