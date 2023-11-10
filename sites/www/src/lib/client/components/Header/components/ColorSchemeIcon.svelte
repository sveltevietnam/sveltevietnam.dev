<script lang="ts">
  export let scheme: ColorScheme;
  export let width = 20;
  export let height = 20;
</script>

{#if scheme === 'light'}
  <svg inline-src="icon/sun" {height} {width} />
{:else if scheme === 'dark'}
  <svg inline-src="icon/moon" {height} {width} />
{:else}
  <svg inline-src="icon/sliders-horizontal" {height} {width} />
{/if}
