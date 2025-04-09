<script lang="ts">
	import type { PageData } from './$types';

	let { data }: { data: PageData }  = $props();
</script>

{#if data.content}
	{#key data.content}
		<data.content {data} />
	{/key}
{/if}
