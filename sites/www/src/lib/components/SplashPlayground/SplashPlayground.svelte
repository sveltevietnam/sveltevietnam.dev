<script context="module" lang="ts">
	import { writable } from 'svelte/store';

	import { getLangContext } from '$lib/contexts/lang';

	export const translations = {
		vi: {
			variants: {
				choose: 'Chọn biến thể',
				short: 'Ngắn',
				long: 'Dài',
			},
			controls: {
				play: 'Chạy',
				pause: 'Dừng',
			},
		},
		en: {
			variants: {
				choose: 'Choose variant',
				short: 'Short',
				long: 'Long',
			},
			controls: {
				play: 'Play',
				pause: 'Pause',
			},
		},
	};
</script>

<script lang="ts">
	export let variant: 'short' | 'long' = 'short';
	export let controls = createSplashControlStore();

	$: if (variant) controls.reset();

	let rerender = 0;
	let splashEl: HTMLDivElement;
	function createSplashControlStore() {
		const { subscribe, set } = writable<'paused' | 'running'>('paused');

		let started = false;

		function pause() {
			set('paused');
		}

		function reset() {
			splashEl?.removeEventListener('animationend', onAnimationEnd);
			pause();
			started = false;
			rerender++;
		}

		function onAnimationEnd(e: AnimationEvent) {
			if (!splashEl) return;
			if (!splashEl.isSameNode(e.target as HTMLElement)) return;
			reset();
		}

		function play() {
			set('running');
			if (started) return;
			started = true;
			splashEl?.addEventListener('animationend', onAnimationEnd);
		}
		return {
			subscribe,
			play,
			pause,
			reset,
		};
	}

	function splashToggle() {
		if ($controls === 'paused') {
			controls?.play();
		} else {
			controls?.pause();
		}
	}

	const { lang } = getLangContext();

	$: t = translations[$lang];
</script>

<div class="not-prose">
	<div class="mb-4 flex w-full gap-4 sp:flex-col">
		<div class="flex flex-1 items-center gap-3">
			<p>{t.variants.choose}:</p>
			<label class="flex items-center gap-1">
				<input
					class="c-input"
					type="radio"
					name="splash-variant"
					bind:group={variant}
					value="short"
					id="splash-variant-short"
				/>
				<span>{t.variants.short}</span>
			</label>
			<label class="flex items-center gap-1">
				<input
					class="c-input"
					type="radio"
					name="splash-variant"
					bind:group={variant}
					value="long"
					id="splash-variant-long"
				/>
				<span>{t.variants.long}</span>
			</label>
		</div>
		<button class="c-btn w-28" on:click={splashToggle} type="button">
			{#if $controls === 'paused'}
				{t.controls.play}
			{:else}
				{t.controls.pause}
			{/if}
		</button>
	</div>
	<div class="splash-playground">
		{#key rerender}
			<div
				class="c-splash c-splash--{variant}"
				aria-disabled
				data-play-state={$controls}
				bind:this={splashEl}
			>
				<div class="__logoWrapper">
					<div class="__logo c-logo c-logo--themed"></div>
				</div>
				<div class="__title">
					<svg width="148" height="67" fill="none" xmlns="http://www.w3.org/2000/svg">
						<path
							d="M15.45 7.188c-.143-1.208-.723-2.146-1.74-2.813-1.017-.668-2.265-1.002-3.743-1.002-1.081 0-2.027.175-2.838.525-.803.35-1.43.83-1.883 1.442a3.458 3.458 0 0 0-.668 2.087c0 .651.155 1.212.465 1.68.318.462.723.847 1.216 1.157.493.302 1.01.553 1.55.751.54.19 1.037.346 1.49.465l2.48.668c.635.167 1.343.397 2.122.691a9.798 9.798 0 0 1 2.253 1.204 6.127 6.127 0 0 1 1.788 1.932c.469.786.703 1.752.703 2.897 0 1.319-.345 2.511-1.037 3.576-.683 1.065-1.685 1.912-3.004 2.54-1.311.627-2.905.941-4.78.941-1.75 0-3.263-.282-4.543-.846-1.271-.564-2.273-1.351-3.004-2.36-.723-1.01-1.133-2.182-1.228-3.518h3.052c.08.922.39 1.685.93 2.29.548.595 1.24 1.04 2.074 1.334.843.287 1.749.43 2.718.43 1.129 0 2.142-.183 3.04-.549.899-.373 1.61-.89 2.135-1.55.524-.667.786-1.446.786-2.336 0-.81-.226-1.47-.68-1.98-.452-.508-1.048-.921-1.787-1.239a18.788 18.788 0 0 0-2.397-.835l-3.004-.858c-1.907-.548-3.418-1.331-4.53-2.348-1.113-1.018-1.67-2.349-1.67-3.994 0-1.367.37-2.56 1.11-3.577.747-1.025 1.748-1.82 3.004-2.384 1.263-.572 2.674-.858 4.232-.858 1.574 0 2.972.282 4.196.846 1.224.556 2.194 1.32 2.91 2.289a5.701 5.701 0 0 1 1.144 3.302H15.45Zm9.058-6.104 7.248 20.553h.286l7.249-20.553h3.1L33.425 25.5h-3.052L21.408 1.084h3.1ZM46.194 25.5V1.084h14.735v2.623H49.15v8.25h11.016v2.623H49.15v8.297h11.97V25.5H46.193Zm20.064 0V1.084h2.956v21.793h11.35V25.5H66.258ZM80.56 3.707V1.084h18.312v2.623h-7.677V25.5h-2.957V3.707h-7.677ZM103.435 25.5V1.084h14.736v2.623h-11.779v8.25h11.016v2.623h-11.016v8.297h11.969V25.5h-14.926ZM3.1 42.084l7.248 20.553h.286l7.248-20.553h3.1L12.017 66.5H8.965L0 42.084h3.1Zm24.642 0V66.5h-2.957V42.084h2.957ZM33.67 66.5V42.084h14.735v2.623H36.626v8.25h11.016v2.623H36.626v8.297h11.97V66.5H33.67Zm18.729-21.793v-2.623H70.71v2.623h-7.677V66.5h-2.957V44.707H52.4Zm42.235-2.623V66.5h-2.861L78.468 47.33h-.238V66.5h-2.957V42.084h2.862l13.352 19.218h.238V42.084h2.91Zm6.918 24.416h-3.1l8.965-24.416h3.052l8.965 24.416h-3.099l-7.296-20.553h-.191L101.552 66.5Zm1.144-9.537h12.494v2.622h-12.494v-2.622Zm20.541-14.879h3.529l8.298 20.267h.286l8.297-20.267h3.529V66.5h-2.766V47.95h-.238l-7.63 18.55h-2.671l-7.629-18.55h-.239V66.5h-2.766V42.084Z"
							fill="currentcolor"
						/>
					</svg>
				</div>
			</div>
		{/key}
	</div>
</div>

<style lang="postcss">
	.splash-playground {
		overflow: hidden;
		background-color: theme('colors.bg.DEFAULT');
		border: 1px solid theme('colors.outline.DEFAULT');

		& .c-splash {
			position: static;
			z-index: unset;
			width: 100%;
			height: 400px;

			@screen tb {
				height: 500px;
			}

			&[data-play-state='paused'] {
				animation-play-state: paused;
			}

			&[data-play-state='running'] {
				animation-play-state: running;
			}
		}
	}
</style>
