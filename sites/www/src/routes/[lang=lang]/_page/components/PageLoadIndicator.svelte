<!-- shameless copy from  https://github.com/sveltejs/site-kit/blob/master/packages/site-kit/src/lib/nav/PreloadingIndicator.svelte -->
<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	const p = tweened(0);
	onMount(() => {
		p.set(1, {
			duration: 8000,
			easing(t) {
				const steps = [0, 0.2, 0.6, 0.75, 1] as const;
				for (let i = 0; i < steps.length; i++) {
					if (t < steps[i]) {
						const stepDuration = steps[i] - steps[i - 1];
						return cubicInOut((t - steps[i - 1]) / stepDuration) * stepDuration + steps[i - 1];
					}
				}
				return 1;
			},
		});
	});
</script>

<progress max="100" value={$p * 100} style="--percentage: {$p * 100}%" aria-label="page loading"
	>{$p}%</progress
>

<style>
	progress {
		--percentage: 0%;

		position: fixed;
		z-index: theme('zIndex.notification');
		top: 0;
		right: 0;
		left: 0;

		width: 100%;
		height: 2px;

		visibility: hidden;

		&::after {
			content: '';

			position: absolute;
			top: 0;
			left: 0;

			width: var(--percentage);
			height: 100%;

			visibility: visible;
			background-color: theme('colors.orange.DEFAULT');
		}
	}
</style>
