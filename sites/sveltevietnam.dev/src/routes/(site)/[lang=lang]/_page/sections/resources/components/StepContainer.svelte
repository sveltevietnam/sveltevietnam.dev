<script lang="ts">
	import { animate, onScroll } from 'animejs';
	import type { HTMLAttributes } from 'svelte/elements';

	import { SettingsContext } from '$lib/settings/context.svelte';

	let { children, class: cls, ...rest }: HTMLAttributes<HTMLElement> = $props();

	const settings = SettingsContext.get();

	let elementForTransitionIn: HTMLDivElement;
	let elementForTransitionOut: HTMLDivElement;
	let section: HTMLElement;

	$effect(() => {
		const inTransition = animate(elementForTransitionIn, {
			opacity: [0, 1],
			scale: [0.9, 1],
			autoplay: onScroll({
				target: section,
				enter: { target: '0%', container: '100%' },
				leave:
					settings.screen === 'mobile'
						? { target: '0%', container: '60%' }
						: { target: '0%', container: '50%' },
				sync: 0.75,
				repeat: true,
			}),
		});

		const outTransition = animate(elementForTransitionOut, {
			opacity: [1, 0],
			autoplay: onScroll({
				target: section,
				enter:
					settings.screen === 'mobile'
						? { target: '100%', container: '80%' }
						: { target: '100%', container: '20%' },
				leave:
					settings.screen === 'mobile'
						? { target: '100%', container: '40%' }
						: { target: '100%', container: '0%' },
				sync: 0.75,
				repeat: true,
			}),
		});

		return () => {
			inTransition.revert();
			outTransition.revert();
		};
	});
</script>

<div class="will-change-transform" bind:this={elementForTransitionIn}>
	<div bind:this={elementForTransitionOut}>
		<section
			class={[
				'bg-surface max-w-256 tablet:p-10 tablet:gap-15 relative mx-auto flex flex-col gap-8 p-4',
				cls,
			]}
			bind:this={section}
			{...rest}
		>
			{@render children?.()}
			<div
				class="-z-1 from-on-surface via-svelte absolute -inset-0.5 bg-gradient-to-b to-transparent to-90%"
			></div>
		</section>
	</div>
</div>
