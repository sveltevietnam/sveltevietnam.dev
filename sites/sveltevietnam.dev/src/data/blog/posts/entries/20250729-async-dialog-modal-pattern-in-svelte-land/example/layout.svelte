<script lang="ts">
	import { dialogStack } from './dialog';
</script>

<aside class="pointer-events-none fixed inset-0 z-500">
	<!-- :::highlight -->
	{#each dialogStack.items as dialog (dialog.config.id)}
		<div class="pointer-events-auto h-full w-full" use:dialogStack.actions.render={dialog}></div>
	{/each}
	<!-- ::: -->
</aside>
