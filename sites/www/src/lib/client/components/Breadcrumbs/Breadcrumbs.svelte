<script lang="ts">
  import type { Breadcrumb } from '$shared/services/navigation';

  export let breadcrumbs: Breadcrumb[];
  let cls = '';
  export { cls as class };
</script>

<nav aria-label="breadcrumb" class="tp-body2 {cls}">
  <ol class="flex items-center gap-3">
    {#each breadcrumbs as { label, href }, i}
      {@const last = i === breadcrumbs.length - 1}
      <li {...last && { 'aria-current': 'page' }} class="contents">
        {#if href}
          <a {href} class="c-link-neutral shrink-0">{label}</a>
        {:else}
          <span class="text-design-neutral-2 whitespace-nowrap overflow-hidden overflow-ellipsis"
            >{label}</span
          >
        {/if}
        {#if !last}
          <svg inline-src="icon/caret" width="14" height="14" />
        {/if}
      </li>
    {/each}
  </ol>
</nav>
