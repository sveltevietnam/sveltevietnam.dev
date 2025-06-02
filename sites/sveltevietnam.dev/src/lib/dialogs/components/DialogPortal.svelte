<script lang="ts">
	import type { Stack } from '@svelte-put/async-stack';

	let { stack }: { stack: Stack } = $props();
</script>

<aside class="z-dialog pointer-events-none fixed inset-0">
	{#each stack.items as dialog (dialog.config.id)}
		<div class="pointer-events-auto h-full w-full" use:stack.actions.render={dialog}></div>
	{/each}
</aside>
