<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let { class: cls, children, ...rest }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul class={['pl-(--pl) border-l', cls]} {...rest}>
	{#if children}
		{@render children()}
	{/if}
</ul>

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

	ul {
		--pl: 1.5rem; /* 24px */

		@media (--tablet) {
			--pl: 2.5rem; /* 40px */
		}
	}
</style>
