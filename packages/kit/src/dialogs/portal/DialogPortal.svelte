<script lang="ts">
	import { LockScrollContext } from '../../contexts/lockscroll.svelte.js';

	import { type DialogPortalProps } from '.';

	const lockscroll = LockScrollContext.get();

	let { stack, class: cls, ...rest }: DialogPortalProps = $props();
</script>

<aside class={['z-dialog pointer-events-none fixed inset-0', cls]} {...rest}>
	{#each stack.items as dialog (dialog.config.id)}
		<div
			class="pointer-events-auto h-full w-full"
			use:stack.actions.render={dialog}
			{@attach lockscroll.lockWhileMounted()}
		></div>
	{/each}
</aside>
