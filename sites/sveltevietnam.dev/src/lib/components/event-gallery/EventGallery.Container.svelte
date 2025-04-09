<script lang="ts">
	import type { Snippet } from "svelte";
	import type { HTMLAttributes } from "svelte/elements";

	let { class: cls, biggerImages, smallerImages, ...rest }: HTMLAttributes<HTMLElement> & {
		biggerImages?: Snippet<[]>;
		smallerImages?: Snippet<[]>;
	} = $props();
</script>

<div class={["grid gap-6 grid-cols-1 tablet:grid-cols-[3fr_2fr]", cls]} {...rest}>
	<div class="mobile:contents tablet:space-y-6">
		{#if biggerImages}
			{@render biggerImages()}
		{/if}
	</div>
	<div class="mobile:contents tablet:space-y-6">
		{#if smallerImages}
			{@render smallerImages()}
		{/if}
	</div>
</div>
