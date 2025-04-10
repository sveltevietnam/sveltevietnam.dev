<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	let { children, ...rest }: HTMLAttributes<HTMLUListElement> = $props();
</script>

<ul {...rest}>
	{#if children}
		{@render children()}
	{/if}
</ul>
