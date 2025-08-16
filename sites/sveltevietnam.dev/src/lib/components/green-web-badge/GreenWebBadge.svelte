<script lang="ts">
	import type { HTMLAnchorAttributes } from 'svelte/elements';

	let {
		class: cls,
		...rest
	}: HTMLAnchorAttributes = $props();
</script>

<a
	class={['green-web-badge', cls]}
	lang="en"
	href="https://www.thegreenwebfoundation.org/green-web-check/?url=sveltevietnam.dev"
	{...rest}
>
	<span class="flex items-start justify-between gap-4">
		<span class="border-b-onehalf border-current font-medium uppercase tracking-wider"
			>Green Hosting</span
		>
		<svg inline-src="./logo-gwf.svg"></svg>
	</span>
	<span class="text-2xs leading-tight">
		<span>sveltevietnam.dev</span>
		<br />
		<span>Hosted by Cloudflare</span>
	</span>
	<span class="border-t-onehalf mt-1 border-current pt-1 text-right text-xs uppercase tracking-wide"
		>Green web Foundation</span
	>
</a>

<style lang="postcss">
	@layer components {
		a {
			display: flex;
			flex-direction: column;

			padding: 0.25rem 0.5rem;
			border: 2px solid currentcolor;
			border-radius: 0.5rem;

			background-image: linear-gradient(
				45deg,
				var(--color-green-web-gradient-start) 4%,
				var(--color-green-web-gradient-midway) 24%,
				var(--color-green-web-gradient-end) 32%
			);
		}

		:global {
			.green-web-badge {
				--color-green-web-gradient-start: light-dark(#06ff06, #008400);
				--color-green-web-gradient-midway: light-dark(#dffcdd, #233a21);
				--color-green-web-gradient-end: var(--color-surface);
			}
		}
	}
</style>
