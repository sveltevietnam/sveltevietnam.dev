<script lang="ts">
	import type { ColorScheme } from '@sveltevietnam/kit/constants';
	import type { HTMLAttributes } from 'svelte/elements';

	let {
		scheme,
		class: cls,
		...rest
	}: HTMLAttributes<HTMLElement> & { scheme: ColorScheme } = $props();
</script>

<span
	class={['bg-surface-variant relative space-y-2 overflow-hidden p-2', cls]}
	data-scheme={scheme}
	{...rest}
>
	<span class="bg-surface space-y-2 p-2">
		<span class="bg-surface-variant h-2 w-1/2"></span>
		<span class="bg-surface-variant h-2 w-2/3"></span>
	</span>
	{#each { length: 2 }, i (i)}
		<span class="bg-surface flex items-center gap-2 p-2">
			<span class="bg-surface-variant h-4 w-4 rounded-full"></span>
			<span class="bg-surface-variant h-2 w-2/3"></span>
		</span>
	{/each}
</span>

<style lang="postcss">
	@layer components {
		span {
			display: block;
		}

		[data-scheme='light'] {
			color-scheme: light;
		}

		[data-scheme='dark'] {
			color-scheme: dark;
		}

		[data-scheme='system'] {
			color-scheme: light;

			&::after {
				content: '';

				position: absolute;
				inset: 0;

				background-color: rgb(0 0 0 / 60%); /* fallback if invert is not supported */
				clip-path: polygon(0% 100%, 100% 0%, 100% 100%);
				backdrop-filter: invert(0.8);
			}
		}
	}
</style>
