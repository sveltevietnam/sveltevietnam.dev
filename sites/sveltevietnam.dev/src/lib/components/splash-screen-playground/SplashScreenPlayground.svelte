<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';
	import { SplashScreen } from '$lib/components/splash-screen';

	let {
		variant = 'short',
		...rest
	}: HTMLAttributes<HTMLElement> & {
		variant?: 'short' | 'long';
	} = $props();

	let rerender = $state(0);
	let playState = $state<'paused' | 'running'>('paused');

	$effect(() => {
		// eslint-disable-next-line @typescript-eslint/no-unused-expressions
		variant;
		playState = 'paused';
	});

	function reset() {
		playState = 'paused';
		rerender++;
	}

	function toggle() {
		playState = playState === 'paused' ? 'running' : 'paused';
	}
</script>

<div {...rest}>
	<div class="mobile:flex-col mb-4 flex items-center w-full gap-4">
		<div class="flex flex-1 items-center gap-3">
			<p><T message={m['components.splash_screen_playground.choose']} />:</p>
			<label class="flex items-center gap-1">
				<input
					class="c-radio"
					type="radio"
					name="splash-variant"
					bind:group={variant}
					value="short"
					id="splash-variant-short"
				/>
				<span><T message={m['components.splash_screen_playground.short']} /></span>
			</label>
			<label class="flex items-center gap-1">
				<input
					class="c-radio"
					type="radio"
					name="splash-variant"
					bind:group={variant}
					value="long"
					id="splash-variant-long"
				/>
				<span><T message={m['components.splash_screen_playground.long']} /></span>
			</label>
		</div>
		<button class="c-btn px-6" onclick={toggle} type="button">
			{#if playState === 'paused'}
				<T message={m['components.splash_screen_playground.play']} />
			{:else}
				<T message={m['components.splash_screen_playground.pause']} />
			{/if}
		</button>
	</div>
	<div class="splash-playground bg-surface overflow-hidden border">
		{#key rerender}
			<SplashScreen ondone={reset} data-play-state={playState} {variant} />
		{/key}
	</div>
</div>

