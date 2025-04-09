<script lang="ts">
	let { data } = $props();
</script>

{#if data.content}
	{#key data.content}
		<data.content />
	{/key}
{/if}
