<script lang="ts">
  import figure from './tba-figure.webp';
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
  <div class={cls}>
    <img src={figure} alt="to be announced" width="357" height="357" class="m-auto max-w-full" />
    <div class="mt-6">
      <slot />
    </div>
  </div>
{/if}
