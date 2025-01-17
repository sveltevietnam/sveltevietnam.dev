<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import { SplashScreen } from '$lib/components/splash-screen';

	let {
		variant = 'short',
		locale,
		...rest
	}: HTMLAttributes<HTMLElement> & {
		variant?: 'short' | 'long';
		locale: import('./locales/generated').Locale;
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
			<p><T message={locale.choose} />:</p>
			<label class="flex items-center gap-1">
				<input
					class="c-radio"
					type="radio"
					name="splash-variant"
					bind:group={variant}
					value="short"
					id="splash-variant-short"
				/>
				<span><T message={locale.short} /></span>
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
				<span><T message={locale.long} /></span>
			</label>
		</div>
		<button class="c-btn px-6" onclick={toggle} type="button">
			{#if playState === 'paused'}
				<T message={locale.play} />
			{:else}
				<T message={locale.pause} />
			{/if}
		</button>
	</div>
	<div class="splash-playground bg-surface overflow-hidden border">
		{#key rerender}
			<SplashScreen ondone={reset} data-play-state={playState} {variant} />
		{/key}
	</div>
</div>

