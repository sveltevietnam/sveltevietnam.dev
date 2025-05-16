<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';

	import * as m from '$data/locales/generated/messages';

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

	function onAnimationEnd(e: AnimationEvent) {
		if ((e.currentTarget as Node).isSameNode(e.target as Node)) {
			reset();
		}
	}
</script>

<div {...rest}>
	<div class="mobile:flex-col mb-4 flex w-full items-center gap-4">
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
			<div
				data-variant={variant}
				data-play-state={playState}
				onanimationend={onAnimationEnd}
				class="splash-screen bg-surface h-100 tablet:h-125 flex w-full items-center justify-center"
				{...rest}
			>
				<div class="_logo-wrapper">
					<div class="_logo w-26 h-26 i i-sveltevietnam -mr-2 block"></div>
				</div>
				<div class="_title pl-2.5"></div>
			</div>
		{/key}
	</div>
</div>
