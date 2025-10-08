<script lang="ts" module>
	import { onMount } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface CountdownProps extends HTMLAttributes<HTMLTimeElement> {
		endAt: Date | string | number;
		resolution?: number; // in milliseconds, default to 1000ms
		onEnd?: () => void;
	}
</script>

<script lang="ts">
	let { endAt, resolution, onEnd, ...rest }: CountdownProps = $props();

	let date = $derived(new Date(endAt));
	let now = $state(new Date());
	let duration = $derived.by(() => {
		let ms = date.getTime() - now.getTime();

		if (ms <= 0) {
			return {
				attribute: 'PT0S',
				display: '00:00',
			};
		}

		// calculate absolute
		let seconds = ms / 1000;
		let minutes = seconds / 60;
		let hours = minutes / 60;

		// floor
		seconds = Math.floor(seconds % 60);
		minutes = Math.floor(minutes % 60);
		hours = Math.floor(hours % 24);

		const pad = (n: number) => n.toString().padStart(2, '0');
		if (hours > 0) {
			return {
				attribute: `PT${hours}H${minutes}M${seconds}S`,
				display: `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`,
			};
		}

		return {
			attribute: `PT${minutes}M${seconds}S`,
			display: `${pad(minutes)}:${pad(seconds)}`,
		};
	});

	let intervalId: ReturnType<typeof setInterval> | undefined = undefined;
	$effect(() => {
		if (now > date) {
			clearInterval(intervalId);
			onEnd?.();
		}
	});

	onMount(() => {
		intervalId = setInterval(() => {
			now = new Date();
		}, resolution);

		return () => clearInterval(intervalId);
	});
</script>

<time datetime={duration.attribute} {...rest}>
	{duration.display}
</time>
