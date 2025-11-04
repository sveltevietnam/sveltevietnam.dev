<script lang="ts">
	import { type DialogPortalProps } from '.';

	let { stack, class: cls, ...rest }: DialogPortalProps = $props();

	// FIXME: we're not locking scroll when dialog is opened for now
	// as of svelte@5.43.3 & @sveltejs/kit@2.48.4, apply lockscroll does not release
	// once user starts to type something into the search dialog, maybe something to do
	// with the async work in there. Investigate later!
</script>

<aside class={['z-dialog pointer-events-none fixed inset-0', cls]} {...rest}>
	{#each stack.items as dialog (dialog.config.id)}
		<div class="pointer-events-auto h-full w-full" use:stack.actions.render={dialog}></div>
	{/each}
</aside>
