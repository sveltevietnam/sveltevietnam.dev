<script lang="ts">
  let cls = '';
  export { cls as class };
</script>

<div class="w-full border rounded-[16px] border-design-fg-1 pt-20 pb-14 {cls}">
  <svg inline-src="tba" width="323" height="94" class="mx-auto max-w-full" />
  <div class="mt-10">
    <slot />
  </div>
</div>
