<script lang="ts">
  export let ref: string;
</script>

{#if ref === 'linkedin'}
  <svg data-inline-src="simpleicon/linkedin" />
{:else if ref === 'github'}
  <svg data-inline-src="simpleicon/github" />
{:else if ref === 'twitter'}
  <svg data-inline-src="simpleicon/twitter" />
{:else if ref === 'website'}
  <svg data-inline-src="google/public" />
{/if}
