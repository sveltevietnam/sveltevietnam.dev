<script lang="ts">
	import type { EnhancedImgAttributes } from '@sveltejs/enhanced-img';
	import type { Snippet } from 'svelte';

	let {
		caption,
		src,
		alt,
		class: cls,
		fetchpriority = 'low',
		loading = 'lazy',
		decoding = 'async',
		effect,
		...rest
	}: EnhancedImgAttributes & {
		caption?: Snippet<[]>;
		effect?: 'grayscale';
	} = $props();
</script>

<figure
	class={[
		effect === 'grayscale' &&
			'can-hover:grayscale duration-400 transition-[filter] hover:grayscale-0 hover:duration-100',
	]}
>
	<enhanced:img
		class={['border', cls]}
		{fetchpriority}
		{loading}
		{decoding}
		{src}
		{alt}
		{...rest}
	/>
	{#if caption}
		<figcaption class="c-text-body-sm text-on-surface-subtle mt-2">
			{@render caption()}
		</figcaption>
	{/if}
</figure>
