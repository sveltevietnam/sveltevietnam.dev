<script lang="ts">
	export let ref: string;
</script>

{#if ref === 'linkedin'}
	<svg inline-src="lucide/linkedin" />
{:else if ref === 'github'}
	<svg inline-src="lucide/github" />
{:else if ref === 'twitter'}
	<svg inline-src="lucide/twitter" />
{:else if ref === 'website'}
	<svg inline-src="lucide/globe" />
{/if}
