<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: cls,
		variant,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		variant?: 'default' | 'full';
	} = $props();
</script>

{#if variant === 'full'}
	<div class={['bg-primary h-6 w-full', cls]}></div>
{:else}
	<div class={['flex gap-3', cls]} {...rest}>
		<div class="bg-primary h-6 w-6"></div>
		<div class="bg-primary h-6 flex-1"></div>
		<div class="bg-primary h-6 w-6"></div>
		<div class="bg-primary h-6 w-6 rounded-full"></div>
		<div class="bg-primary h-6 w-6"></div>
		<div class="bg-primary h-6 flex-1"></div>
		<div class="bg-primary h-6 w-6"></div>
	</div>
{/if}
