<script lang="ts">
	import { afterNavigate } from '$app/navigation';

	import { LockScrollContext } from '../../contexts/lockscroll.svelte.js';

	import { type DialogPortalProps } from '.';

	const lockscroll = LockScrollContext.get();

	let { stack, class: cls, ...rest }: DialogPortalProps = $props();

	// FIXME: workaround as of svelte@5.43.3, @sveltejs/kit@2.48.4
	// attachment/action cleanup not called on navigation
	afterNavigate(() => {
		stack.items = [];
	});
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
