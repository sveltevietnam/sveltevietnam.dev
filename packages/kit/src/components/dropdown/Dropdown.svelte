<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';

	import type { DropdownProps } from '.';

	let {
		direction = 'down',
		align = 'right',
		label,
		content,
		open = $bindable(false),
		...rest
	}: DropdownProps = $props();
</script>

<details
	bind:open
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
	data-direction={direction}
	data-align={align}
	{...rest}
>
	<summary>{@render label?.()}</summary>
	<div>
		{@render content?.()}
	</div>
</details>

<style lang="postcss">
	@layer components {
		details {
			position: relative;

			interpolate-size: allow-keywords;

			@supports not selector(::details-content) {
				& div {
					position: absolute;
				}

				&[data-direction='down'] div {
					top: 100%;
					margin-top: calc(1.5 * var(--spacing));
				}

				&[data-direction='up'] div {
					bottom: 100%;
					margin-bottom: calc(1.5 * var(--spacing));
				}

				&[data-align='left'] div {
					left: 0;
				}

				&[data-align='right'] div {
					right: 0;
				}
			}

			&::details-content {
				position: absolute;

				overflow: hidden;

				block-size: 0;

				transition-timing-function: var(--default-transition-timing-function);
				transition-duration: 150ms;
				transition-property: block-size, content-visibility;

				transition-behavior: allow-discrete;
			}

			&[data-direction='down']::details-content {
				top: 100%;
				margin-top: calc(1.5 * var(--spacing));
			}

			&[data-direction='up']::details-content {
				bottom: 100%;
				margin-bottom: calc(1.5 * var(--spacing));
			}

			&[data-align='left']::details-content {
				left: 0;
			}

			&[data-align='right']::details-content {
				right: 0;
			}

			&:open::details-content {
				block-size: auto;
			}
		}

		summary {
			cursor: pointer;
			overflow: hidden;
		}
	}

	summary {
		display: block;
	}
</style>
