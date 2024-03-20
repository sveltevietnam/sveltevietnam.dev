<script lang="ts">
	import { onMount } from 'svelte';

	export let date: string | Date;
	let cls = '';
	export { cls as class };

	$: ({ days, hours, min, sec } = tick());

	function tick() {
		const distance = new Date(date).getTime() - new Date().getTime();

		return {
			days: Math.floor(distance / (1000 * 60 * 60 * 24))
				.toString()
				.padStart(2, '0'),
			hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
				.toString()
				.padStart(2, '0'),
			min: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
				.toString()
				.padStart(2, '0'),
			sec: Math.floor((distance % (1000 * 60)) / 1000)
				.toString()
				.padStart(2, '0'),
		};
	}

	onMount(() => {
		const id = setInterval(() => {
			({ days, hours, min, sec } = tick());
		}, 1000);

		return () => {
			clearInterval(id);
		};
	});
</script>

<div class="$container {cls}">
	<div class="countdown">
		<p>
			<span>{days}</span>
			<span>days</span>
		</p>

		<p>
			<span>{hours}</span>
			<span>hours</span>
		</p>

		<p>
			<span>{min}</span>
			<span>min</span>
		</p>

		<p>
			<span>{sec}</span>
			<span>sec</span>
		</p>
	</div>
</div>

<style lang="postcss">
	.\$container {
		container-name: countdown;
		container-type: inline-size;
	}

	.countdown {
		display: flex;
		gap: theme('spacing.3');
		justify-content: center;

		@container countdown (min-width: 375px) {
			gap: theme('spacing.4');
		}

		@container countdown (min-width: 600px) {
			gap: theme('spacing.5');
		}
	}

	p {
		display: flex;
		flex-direction: column;
		gap: theme('spacing.1');
		align-items: center;
		justify-content: center;

		width: fit-content;
		padding: theme('spacing.3');

		text-align: center;

		background-color: theme('colors.bg.100');
		border-radius: theme('borderRadius.md');

		& :first-child {
			display: inline-block;

			width: 2ch;

			font-size: theme('fontSize.3xl');
			font-weight: theme('fontWeight.bold');
			line-height: 1;
		}

		& :last-child {
			color: theme('colors.fg.200');
		}

		@container countdown (min-width: 375px) {
			padding: theme('spacing.4');

			& :first-child {
				font-size: theme('fontSize.4xl');
			}
		}

		@container countdown (min-width: 600px) {
			padding: theme('spacing.6');

			& :first-child {
				font-size: theme('fontSize.5xl');
			}
		}
	}
</style>
