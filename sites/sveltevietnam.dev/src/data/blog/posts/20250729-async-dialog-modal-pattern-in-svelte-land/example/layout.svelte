<script lang="ts">
	import { dialogStack } from './dialog';
</script>

<aside class="z-500 pointer-events-none fixed inset-0">
	<!-- :::highlight -->
	{#each dialogStack.items as dialog (dialog.config.id)}
		<div class="pointer-events-auto h-full w-full" use:dialogStack.actions.render={dialog}></div>
	{/each}
	<!-- ::: -->
</aside>
