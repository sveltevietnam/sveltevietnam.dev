<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		class: cls,
		variant,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		variant?: 'default' | 'full' | 'flag';
	} = $props();
</script>

{#if variant === 'full'}
	<div class={['bg-primary h-6 w-full', cls]} {...rest}></div>
{:else if variant === 'flag'}
	<div class={['flex gap-3', cls]} {...rest}>
		<div class="bg-primary h-6 w-6"></div>
		<div class="bg-primary h-6 flex-1"></div>
		<svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
			<path fill="currentcolor" d="M0 0h40v24L20 40 0 24V0Z" />
		</svg>
		<div class="bg-primary h-6 w-6"></div>
		<svg class="text-primary" xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none">
			<path fill="currentcolor" d="M0 0h40v24L20 40 0 24V0Z" />
		</svg>
		<div class="bg-primary h-6 flex-1"></div>
		<div class="bg-primary h-6 w-6"></div>
	</div>
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
