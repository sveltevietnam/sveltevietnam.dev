<script lang="ts">
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	import { SettingsContext } from '$lib/settings/context.svelte';

	// import splashScriptSrc from './splash.js?url';

	const settings = SettingsContext.get();

	let {
		variant = 'short',
		class: cls,
		root = false,
		ondone = () => {},
		...rest
	}: HTMLAttributes<HTMLElement> & {
		variant?: 'short' | 'long';
		root?: boolean;
		ondone?: () => void;
	} = $props();

	let splashEl: HTMLDivElement;
	function onAnimationEnd(e: AnimationEvent) {
		if (splashEl.isSameNode(e.target as Node)) {
			ondone();
		}
	}

	onMount(() => {
		settings.splashed = true;
	});
</script>

<div
	bind:this={splashEl}
	data-variant={variant}
	onanimationend={onAnimationEnd}
	class={[
		'splash-screen',
		'bg-surface flex items-center justify-center',
		root ? 'z-overlay fixed inset-0' : 'h-100 tablet:h-125 w-full',
		cls,
	]}
	{...root && { id: 'splash' }}
	{...rest}
>
	<div class="_logo-wrapper">
		<div class="_logo w-26 h-26 i i-sveltevietnam -mr-2 block"></div>
	</div>
	<div class="_title pl-2.5">
		<svg class="h-19.5 w-auto" inline-src="./name.svg"></svg>
	</div>
	<!-- FIXME: find reliable way to get timestamp of splash screen completion  -->
	<!-- {#if root} -->
	<!-- 	<script src={splashScriptSrc}></script> -->
	<!-- {/if} -->
</div>

<style lang="postcss">
	.splash-screen {
		--animation-in-duration: 800ms;
		--animation-out-duration: 800ms;

		animation-name: splash-out;
		animation-duration: calc(var(--animation-out-duration) * 0.6);
		animation-play-state: running;
		animation-timing-function: ease;
		animation-fill-mode: forwards;
		animation-delay: calc(var(--animation-in-duration) + var(--animation-out-duration) * 0.4);

		&[data-play-state='running'] {
			animation-play-state: running;
		}

		&[data-play-state='paused'] {
			animation-play-state: paused;
		}
	}

	._logo-wrapper {
		position: relative;
		animation-play-state: inherit;
	}

	._title {
		position: relative;
		animation-play-state: inherit;
	}

	@keyframes splash-out {
		from {
			transform: translateY(0);
		}

		to {
			transform: translateY(-100%);
		}
	}

	/* ========= SHORT variant ========= */
	.splash-screen[data-variant='short'] {
		--animation-in-duration: 500ms;

		& ._logo-wrapper,
		& ._title {
			--translate-x: 0;

			animation-name: splash-in-short;
			animation-duration: var(--animation-in-duration);
			animation-timing-function: cubic-bezier(0.55, 2.12, 0.19, 0.57);
		}

		& ._logo-wrapper {
			--translate-x: 30px;

			z-index: 2;
		}

		& ._title {
			--translate-x: -30px;

			z-index: 1;
		}
	}

	@keyframes splash-in-short {
		from {
			transform: translateX(var(--translate-x));
			opacity: 0;
		}

		to {
			transform: translateX(0);
			opacity: 1;
		}
	}

	/* ========= LONG variant ========= */
	.splash-screen[data-variant='long'] {
		--animation-in-duration: 1500ms;

		--animation-timing-function-1: cubic-bezier(1, 1.85, 0.44, 0.7);
		--animation-timing-function-2: cubic-bezier(0.55, 2.12, 0.19, 0.57);
		--step-1-duration: calc(0.4 * var(--animation-in-duration));
		--step-2-duration: calc(0.3 * var(--animation-in-duration));
		--step-3-duration: calc(0.2 * var(--animation-in-duration));
		--step-rest: calc(0.1 * var(--animation-in-duration));
		--step-2-delay: calc(var(--step-1-duration) + var(--step-rest));
		--step-3-delay: calc(var(--step-2-delay) + var(--step-2-duration) + var(--step-rest));

		& ._logo-wrapper {
			position: relative;
			z-index: 1;
			transform: translateX(6px);

			overflow: hidden;

			animation-name: splash-in-long-step-2-logo-container;
			animation-duration: var(--step-2-duration);
			animation-timing-function: var(--animation-timing-function-1);
			animation-fill-mode: forwards;
			animation-delay: var(--step-2-delay);
		}

		& ._logo {
			transform: translateX(70%);

			animation-name:
				splash-in-long-step-1-logo, splash-in-long-step-2-logo, splash-in-long-step-3-logo;
			animation-duration: var(--step-1-duration), var(--step-2-duration), var(--step-3-duration);
			animation-play-state: inherit;
			animation-timing-function:
				var(--animation-timing-function-1), var(--animation-timing-function-1),
				var(--animation-timing-function-2);
			animation-fill-mode: forwards;
			animation-delay: 0ms, var(--step-2-delay), var(--step-3-delay);
		}

		& ._title {
			position: relative;
			z-index: 2;
			overflow: hidden;

			&::after {
				content: '';

				position: absolute;
				inset: 0 -2px 0 0;
				transform-origin: right;
				transform: scaleX(1);

				background-color: var(--color-surface);

				animation-name:
					splash-in-long-step-1-title-overlay, splash-in-long-step-2-title-overlay,
					splash-in-long-step-3-title-overlay;
				animation-duration: var(--step-1-duration), var(--step-2-duration), var(--step-3-duration);
				animation-play-state: inherit;
				animation-timing-function:
					var(--animation-timing-function-1), var(--animation-timing-function-1),
					var(--animation-timing-function-2);
				animation-fill-mode: forwards;
				animation-delay: 0ms, var(--step-2-delay), var(--step-3-delay);
			}
		}
	}

	/* --------- step 1 --------- */
	@keyframes splash-in-long-step-1-logo {
		to {
			transform: translateX(42%);
		}
	}

	@keyframes splash-in-long-step-1-title {
		to {
			transform: translateX(5%);
		}
	}

	@keyframes splash-in-long-step-1-title-overlay {
		to {
			transform: scaleX(0.5);
		}
	}

	/* --------- step 2 --------- */
	@keyframes splash-in-long-step-2-logo {
		to {
			transform: translateX(20%);
		}
	}

	@keyframes splash-in-long-step-2-logo-container {
		to {
			transform: translateX(0);
		}
	}

	@keyframes splash-in-long-step-2-title-overlay {
		to {
			transform: scaleX(0.2);
		}
	}

	/* --------- step 3 --------- */
	@keyframes splash-in-long-step-3-logo {
		to {
			transform: translateX(0);
		}
	}

	@keyframes splash-in-long-step-3-title-overlay {
		to {
			transform: scaleX(0);
		}
	}

	@keyframes splash-in-long-step-3-title {
		to {
			transform: translateX(0);
		}
	}
</style>
