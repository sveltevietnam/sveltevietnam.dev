<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";

	let { scheme, class: cls, ...rest }: HTMLAttributes<HTMLElement> & { scheme: App.ColorScheme } = $props();
</script>

<span
	class={["relative overflow-hidden bg-surface-variant p-2 space-y-2", cls]}
	data-scheme={scheme}
	{...rest}
>
	<span class="space-y-2 p-2 bg-surface">
		<span class="w-1/2 h-2 bg-surface-variant"></span>
		<span class="w-2/3 h-2 bg-surface-variant"></span>
	</span>
	{#each { length: 2 }, i (i)}
		<span class="p-2 bg-surface flex items-center gap-2">
			<span class="rounded-full w-4 h-4 bg-surface-variant"></span>
			<span class="h-2 w-2/3 bg-surface-variant"></span>
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

