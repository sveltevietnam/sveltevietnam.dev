<script lang="ts">
	import Avatar from '@svelte-put/avatar/Avatar.svelte';
	import debounce from 'lodash.debounce';
	import { cubicOut } from 'svelte/easing';
	import { tweened } from 'svelte/motion';

	import desgnveloperLogoImg from '../images/designveloper_logo.webp';

	import bgDetailImg from './bg-details.svg';
	import titleImg from './title.svg';

	export let number = 0;
	export let email = '';
	export let name = '';

	let cls = '';
	export { cls as class };

	const rotateX = tweened(0, {
		duration: 400,
		easing: cubicOut,
	});

	const rotateY = tweened(0, {
		duration: 400,
		easing: cubicOut,
	});

	let node: HTMLElement;
	function rotate(e: MouseEvent) {
		const rect = node.getBoundingClientRect();
		if (
			e.clientX < rect.left ||
			e.clientX > rect.right ||
			e.clientY < rect.top ||
			e.clientY > rect.bottom
		)
			return;

		const cx = rect.width / 2;
		const cy = rect.height / 2;

		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;
		const dx = x - cx;
		const dy = y - cy;
		$rotateX = (dy / cy) * -8;
		$rotateY = (dx / cx) * 10;
		debouncedRotateOut();
	}

	function rotateOut() {
		window.removeEventListener('mousemove', rotate);
		rotateX.set(0, {
			duration: 1000,
		});
		rotateY.set(0, {
			duration: 1000,
		});
	}

	const debouncedRotateOut = debounce(rotateOut, 1000);

	function onMouseEnter() {
		window.addEventListener('mousemove', rotate);
	}
</script>

<div class="__container {cls}">
	<!-- svelte-ignore a11y-no-static-element-interactions -->
	<div
		class="e-ticket"
		style:--rotate-x="{$rotateX}deg"
		style:--rotate-y="{$rotateY}deg"
		on:mouseenter={onMouseEnter}
		bind:this={node}
	>
		<div class="__header">
			{#if name || email}
				<Avatar size={40} gravatar={email} uiAvatar={name} class="__avatar" />
			{:else}
				<svg inline-src="lucide/circle-user-round" class="__avatar" width="40" height="40" />
			{/if}
			{#if name}
				<p class="mr-auto">{name}</p>
			{:else}
				<div
					class="mr-auto h-4 max-w-32 flex-1 rounded-lg border border-current bg-grayscale-500/20"
				></div>
			{/if}
			<p>#{number.toString().padStart(6, '0')}</p>
			<div class="__sv-logo c-logo c-logo--original">
				<p class="sr-only">Svelte Vietnam</p>
			</div>
		</div>
		<div class="__title">
			<img
				width="584"
				height="287"
				src={bgDetailImg}
				alt="hoa đào, hoa mai"
				class="__title-bg-details-img"
			/>
			<img
				width="490"
				height="98"
				src={titleImg}
				alt="highlighted texts with gradient colors that says 2024 Spring Meetup Svelte Vietnam"
				class="__title-img"
			/>
		</div>
		<div class="__footer">
			<p>
				<span>Hosted by</span>
				<img
					src={desgnveloperLogoImg}
					alt="designveloper"
					width="24"
					height="24"
					class="__dsv-logo"
				/>
				<span>Designveloper</span>
			</p>
			<div class="shrink-0 text-right">
				<p>April 20th, 2024, 09:00 GMT+0700</p>
				<p>55 Phó Đức Chính, Dist. 1, Hồ Chí Minh City</p>
			</div>
		</div>
	</div>
</div>

<style lang="postcss">
	.__container {
		transform-style: preserve-3d;
		container-name: e-ticket;
		container-type: inline-size;
		perspective: 1000px;
	}

	.e-ticket {
		--rotate-x: 0deg;
		--rotate-y: 0deg;

		isolation: isolate;
		transform-origin: center;
		transform: rotateX(var(--rotate-x)) rotateY(var(--rotate-y)) translateZ(0);

		overflow: hidden;
		display: grid;
		grid-template-columns: 1fr;
		gap: 1.5rem;

		width: 100%;
		margin-inline: auto;
		padding: 1.5rem;

		font-family: theme('fontFamily.lora');
		font-weight: theme('fontWeight.medium');
		line-height: theme('lineHeight.normal');
		color: #393939;

		background-image: linear-gradient(to bottom right, #ffec9f 0%, #ffc6df 100%);
		border-radius: theme('borderRadius.2xl');

		@container e-ticket (min-width: 600px) {
			gap: 2.5rem;
			max-width: 720px;
			padding-block: 2rem;
			padding-inline: 2.5rem;
		}
	}

	.__header {
		position: relative;
		z-index: 1;

		display: flex;
		gap: 1rem;
		align-items: center;

		@container e-ticket (min-width: 600px) {
			height: 40px;
			font-size: theme('fontSize.2xl');
		}
	}

	:global(.e-ticket .__avatar) {
		flex-shrink: 0;
		width: auto;
		height: 30px;
		border-radius: theme('borderRadius.full');

		@container e-ticket (min-width: 600px) {
			height: 40px;
		}
	}

	.__sv-logo {
		width: auto;
		height: 30px;

		@container e-ticket (min-width: 600px) {
			height: 40px;
		}
	}

	.__title {
		position: relative;
		z-index: 0;
		width: fit-content;
		margin-inline: auto;
	}

	.__title-bg-details-img {
		position: absolute;
		z-index: 0;
		top: -58px;
		left: -50px;

		width: auto;
		max-width: none;
		height: 200px;

		opacity: 0.25;

		@container e-ticket (min-width: 600px) {
			top: -80px;
			left: -60px;
			height: 287px;
		}

		@container e-ticket (max-width: 400px) {
			top: -50px;
			left: -70px;
			height: 180px;
		}
	}

	.__title-img {
		position: relative;
		z-index: 1;
		width: auto;
		height: 72px;

		@container e-ticket (min-width: 600px) {
			height: 98px;
		}
	}

	.__footer {
		position: relative;
		z-index: 1;

		display: flex;
		gap: 0.5rem;
		align-items: flex-end;
		justify-content: space-between;

		font-size: theme('fontSize.xs');
		line-height: 1.75;

		@container e-ticket (min-width: 600px) {
			font-size: theme('fontSize.base');
		}

		@container e-ticket (max-width: 400px) {
			flex-direction: column;
			gap: 0;
		}
	}

	.__dsv-logo {
		display: inline-block;
		width: auto;
		height: 18px;
		vertical-align: text-bottom;

		@container e-ticket (min-width: 600px) {
			height: 24px;
		}
	}
</style>