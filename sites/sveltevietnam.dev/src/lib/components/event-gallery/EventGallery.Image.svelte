<script lang="ts">
	import type { EnhancedImgAttributes } from "@sveltejs/enhanced-img";
	import type { Snippet } from "svelte";

	let { caption, src, alt, class: cls, ...rest }: EnhancedImgAttributes & {
		caption?: Snippet<[]>;
	} = $props();
</script>

<figure>
	<enhanced:img class={['border', cls]} {src} {alt} {...rest} />
	{#if caption}
		<figcaption class="c-text-body-sm mt-2 text-on-surface-subtle">
			{@render caption()}
		</figcaption>
	{/if}
</figure>
