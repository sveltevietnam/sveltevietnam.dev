<script lang="ts">
	import { onMount } from 'svelte';
	import { derived, writable, type Unsubscriber } from 'svelte/store';

	import { getSplashContext } from '$client/contexts/splash';
	import { gsap, Back } from '$lib/3rd/gsap';

	export let selector = '';
	let cls = '';
	export { cls as class };

	const splashStore = getSplashContext();
	const intersected = writable(false);
	let node: HTMLElement;
	let ctx: gsap.Context;
	onMount(() => {
		let unsub: Unsubscriber;
		ctx = gsap.context(() => {
			const elements = node.querySelectorAll(selector);
			gsap.set(elements, { opacity: 0, y: 20, rotate: 10 });

			const observer = new IntersectionObserver(
				(entries) => {
					if (entries.some((e) => !!e.intersectionRatio)) {
						intersected.set(true);
					}
				},
				{ threshold: 1 },
			);
			observer.observe(node);

			const trigger = derived([splashStore, intersected], ([$splash, $intersected]) => {
				return $splash?.done && $intersected;
			});
			unsub = trigger.subscribe((intro) => {
				if (intro) {
					gsap.to(elements, {
						opacity: 1,
						y: 0,
						rotate: 0,
						duration: 0.6,
						ease: Back.easeOut.config(1.4),
						stagger: 0.05,
					});
					observer?.unobserve(node);
				}
			});
		}, node);

		return () => {
			unsub?.();
			ctx.revert();
		};
	});
</script>

<div class={cls} bind:this={node}>
	<slot />
</div>
