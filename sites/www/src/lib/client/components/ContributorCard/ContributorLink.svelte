<script lang="ts">
	export let ref: string;
</script>

{#if ref === 'linkedin'}
	<svg inline-src="simpleicon/linkedin" />
{:else if ref === 'github'}
	<svg inline-src="simpleicon/github" />
{:else if ref === 'twitter'}
	<svg inline-src="simpleicon/twitter" />
{:else if ref === 'website'}
	<svg inline-src="google/public" />
{/if}
