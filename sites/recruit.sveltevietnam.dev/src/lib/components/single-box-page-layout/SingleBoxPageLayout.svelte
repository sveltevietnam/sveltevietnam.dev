<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { children, class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();
</script>

<div class='max-w-pad mt-header pt-section pb-section-more grid flex-1 place-items-center'>
	<main
		class={[
			"auth tablet:p-10 tablet:border tablet:border-current",
			cls,
		]}
		{...rest}
	>
		{@render children?.()}
	</main>
</div>

<style>
	:global(:root):has(.auth) :global(.toolbar-backdrop) {
		--toolbar-backdrop-opacity: 1 !important;
	}
</style>
