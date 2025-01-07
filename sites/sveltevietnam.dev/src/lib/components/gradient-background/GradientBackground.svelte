<script module>
	const PATTERN_SETTINGS = {
		jigsaw: {
			urls: {
				light: jigsawLight,
				dark: jigsawDark,
			},
			opacity: 0.1,
		},
		circuit: {
			urls: {
				light: circuitLight,
				dark: circuitDark,
			},
			opacity: 0.1,
		},
		none: {
			urls: {
				light: '',
				dark: '',
			},
			opacity: 0,
		},
	} as const;
</script>

<script lang="ts">
	import type { HTMLAttributes } from 'svelte/elements';

	import circuitDark from '$lib/assets/images/patterns/circuit-dark.avif?url';
	import circuitLight from '$lib/assets/images/patterns/circuit-light.avif?url';
	import jigsawDark from '$lib/assets/images/patterns/jigsaw-dark.avif?url';
	import jigsawLight from '$lib/assets/images/patterns/jigsaw-light.avif?url';

	let {
		children,
		class: cls,
		color = 'primary',
		pattern = 'none',
		...rest
	}: {
		color?: 'primary' | 'secondary' | 'tertiary';
		pattern?: 'jigsaw' | 'circuit' | 'none';
	} & HTMLAttributes<HTMLElement> = $props();

	let patternSettings = $derived(PATTERN_SETTINGS[pattern]);
</script>

<div
	class={['_container', cls]}
	style:--pattern-url-dark="url('{patternSettings.urls.dark}')"
	style:--pattern-url-light="url('{patternSettings.urls.light}')"
	style:--pattern-opacity={patternSettings.opacity}
	style:--color={`var(--color-${color}-surface)`}
	{...rest}
>
	<div class="relative z-1">
		{@render children?.()}
	</div>
</div>

<style lang="postcss">
	@import '@sveltevietnam/ui/css/medias';

	@layer svelte {
		._container {
			--color: var(--color);
			--pattern-url-dark: var(--pattern-url-dark);
			--pattern-url-light: var(--pattern-url-light);
			--pattern-opacity: var(--pattern-opacity);
			--pattern-size: var(--pattern-size);

			position: relative;
			background-image: linear-gradient(
				to bottom,
				var(--color-surface),
				var(--color) 20%,
				var(--color) 80%,
				var(--color-surface)
			);

			&::before, &::after {
				content: '';
				position: absolute;
				z-index: 0;
				inset: 0;
			}

			&::before {
				opacity: var(--pattern-opacity);
				background-image: var(--pattern-url-light);
				background-repeat: repeat;
				background-size: 100px;
			}

			&::after {
				background: linear-gradient(
					to bottom,
					var(--color-surface),
					transparent 40%,
					transparent 60%,
					var(--color-surface)
				);
			}
		}

		:global {
			._container {
				@media dark {
					&::before {
						background-image: var(--pattern-url-dark);
					}
				}
			}
		}
	}
</style>
