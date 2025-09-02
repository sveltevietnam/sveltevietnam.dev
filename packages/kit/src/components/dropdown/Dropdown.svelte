<script lang="ts">
	import { clickoutside } from '@svelte-put/clickoutside';

	import type { DropdownProps } from '.';

	let { label, content, open = $bindable(false), ...rest }: DropdownProps = $props();
</script>

<details
	bind:open
	use:clickoutside={{ enabled: open }}
	onclickoutside={() => (open = false)}
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
					top: 100%;
					right: 0;
					margin-top: calc(1.5 * var(--spacing));
				}
			}

			&::details-content {
				position: absolute;
				top: 100%;
				right: 0;

				overflow: hidden;

				block-size: 0;
				margin-top: calc(1.5 * var(--spacing));

				transition-timing-function: var(--default-transition-timing-function);
				transition-duration: 150ms;
				transition-property: block-size, content-visibility;

				transition-behavior: allow-discrete;
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
