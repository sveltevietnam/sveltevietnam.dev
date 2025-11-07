<script lang="ts">
	import ConfirmationDialog, { type ConfirmationDialogProps } from './confirmation-dialog.svelte';
	import { dialogStack } from './dialog';

	let {
		buttonMessage,
		messageOnConfirm,
		messageOnCancel,
		...confirmDialogProps
	}: {
		legend: string;
		buttonMessage: string;
		messageOnConfirm: string;
		messageOnCancel: string;
	} & Omit<ConfirmationDialogProps, 'item'> = $props();

	// :::focus
	// :::highlight
	let output: Awaited<ConfirmationDialogProps['item']['resolution']> = $state();
	async function handleClick() {
		const pushed = dialogStack.push('custom', {
			component: ConfirmationDialog,
			props: confirmDialogProps,
		});
		output = await pushed.resolution;
	}
	// :::
	// :::
</script>

<div class="flex items-baseline gap-4">
	<!-- :::focus -->
	<!-- :::highlight -->
	<button class="c-btn" onclick={handleClick}>
		<!-- ::: -->
		<!-- ::: -->
		{buttonMessage}
	</button>
	{#if output === 'cancel'}
		<p class="text-error-on-surface">
			<i class="i i-[ph--x] h-5 w-5"></i>
			{messageOnCancel}
		</p>
	{:else if output === 'confirm'}
		<p class="text-success-on-surface">
			<i class="i i-[ph--check] h-5 w-5"></i>
			{messageOnConfirm}
		</p>
	{/if}
</div>
