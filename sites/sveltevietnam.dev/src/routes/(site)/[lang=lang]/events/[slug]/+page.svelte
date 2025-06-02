<script lang="ts">
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageData } from './$types';

	let { data }: { data: PageData }  = $props();
</script>

<div {...pagefind.page({ group: 'events', importance: 'detail'})}>
	{#if data.content}
		{#key data.content}
			<data.content {data} />
		{/key}
	{/if}
</div>
