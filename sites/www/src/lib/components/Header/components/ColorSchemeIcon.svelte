<script lang="ts">
	export let scheme: App.ColorScheme;
	export let width = 20;
	export let height = 20;
</script>

{#if scheme === 'light'}
	<svg inline-src="lucide/sun" {height} {width} />
{:else if scheme === 'dark'}
	<svg inline-src="lucide/moon-star" {height} {width} />
{:else}
	<svg inline-src="lucide/sliders-horizontal" {height} {width} />
{/if}
