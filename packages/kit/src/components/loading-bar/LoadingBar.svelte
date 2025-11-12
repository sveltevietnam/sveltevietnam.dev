<script lang="ts">
	import { onMount } from 'svelte';
	import { cubicInOut } from 'svelte/easing';
	import { Tween } from 'svelte/motion';

	const p = new Tween(0, {
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

	onMount(() => {
		p.target = 1;
	});

	let percentage = $derived(p.current * 100);
</script>

<div
	class="z-notification fixed top-0 right-0 left-0 h-0.5 w-full"
	style="--percentage: {percentage}%"
>
	<progress max="100" value={percentage} aria-label="page loading indicator" class="sr-only">
		{percentage}%
	</progress>
	<div
		class="from-primary via-secondary to-tertiary absolute top-0 left-0 h-full bg-linear-to-r"
		style:width="var(--percentage)"
		aria-disabled="true"
	></div>
</div>
