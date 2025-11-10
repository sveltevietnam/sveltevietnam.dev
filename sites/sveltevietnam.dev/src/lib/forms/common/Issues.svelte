<script lang="ts">
	let { name, issues }: { name: string; issues?: { message: string }[] } = $props();
</script>

{#if issues?.length}
	<p class="c-text-body-sm text-red-500" id="error-{name}">
		<!-- eslint-disable-next-line svelte/require-each-key -->
		{#each issues as issue, i}
			<span>{issue.message}</span>{#if i < issues.length - 1},&nbsp;{/if}
		{/each}
	</p>
{/if}
