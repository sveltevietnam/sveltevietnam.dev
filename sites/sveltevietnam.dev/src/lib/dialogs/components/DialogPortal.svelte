<script lang="ts">
	import type { Stack } from '@svelte-put/async-stack';

	import { SettingsContext } from '$lib/settings/context.svelte';

	let { stack }: { stack: Stack } = $props();

	const settings = SettingsContext.get();
</script>

<aside class="z-dialog pointer-events-none fixed inset-0">
	{#each stack.items as dialog (dialog.config.id)}
		<div
			class="pointer-events-auto h-full w-full"
			use:stack.actions.render={dialog}
			{@attach settings.lockScrollWhenMounted}
		></div>
	{/each}
</aside>
