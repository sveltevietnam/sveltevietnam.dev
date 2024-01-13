<script lang="ts" context="module">
	export type NotificationIntent = App.Status;
</script>

<script lang="ts">
	import type { NotificationInstance } from '@svelte-put/noti';
	import { createEventDispatcher } from 'svelte';

	export let notification: NotificationInstance | undefined = undefined;
	export let intent: NotificationIntent | undefined;
	export let icon = true;

	const { progress } = notification ?? {};

	const dispatch = createEventDispatcher<{ resolve: undefined }>();
	const dismiss = () => dispatch('resolve');
</script>

<div
	class="notification notification--{intent}"
	on:mouseenter={progress?.pause}
	on:mouseleave={progress?.resume}
	role="presentation"
>
	{#if icon}
		<div class="icon">
			{#if intent === 'info'}
				<svg inline-src="lucide/info" width="24" height="24" />
			{:else if intent === 'success'}
				<svg inline-src="lucide/check-circle-2" width="24" height="24" />
			{:else if intent === 'warning'}
				<svg inline-src="lucide/alert-triangle" width="24" height="24" />
			{:else if intent === 'error'}
				<svg inline-src="lucide/x-circle" width="24" height="24" />
			{/if}
		</div>
	{/if}
	<div class="content">
		<slot />
	</div>
	<button on:click={dismiss} type="button" class="dismiss-btn">
		<svg inline-src="icon/x" width="24" height="24" />
	</button>
	{#if notification && progress}
		<div
			class="progress"
			class:paused={$progress?.state === 'paused'}
			style={`--progress-duration: ${notification.timeout}ms;`}
		/>
	{/if}
</div>

<style lang="postcss">
	.notification {
		--text-color: theme('colors.info.text');
		--element-color: theme('colors.info.element');
		--surface-color: theme('colors.info.surface.DEFAULT');

		pointer-events: auto;

		position: relative;

		overflow: hidden;
		display: flex;
		gap: 16px;
		align-items: flex-start;

		width: fit-content;
		min-width: 200px;
		padding: 16px;

		color: var(--text-color);

		background-color: var(--surface-color);
		border-radius: 4px;

		&.notification--info {
			--text-color: theme('colors.info.text');
			--element-color: theme('colors.info.element');
			--surface-color: theme('colors.info.surface.DEFAULT');
		}

		&.notification--success {
			--text-color: theme('colors.success.text');
			--element-color: theme('colors.success.element');
			--surface-color: theme('colors.success.surface.DEFAULT');
		}

		&.notification--warning {
			--text-color: theme('colors.warning.text');
			--element-color: theme('colors.warning.element');
			--surface-color: theme('colors.warning.surface.DEFAULT');
		}

		&.notification--error {
			--text-color: theme('colors.error.text');
			--element-color: theme('colors.error.element');
			--surface-color: theme('colors.error.surface.DEFAULT');
		}
	}

	.icon {
		fill: var(--element-color);
	}

	.content {
		flex: 1;
	}

	.progress {
		position: absolute;
		right: 0;
		bottom: 0;
		left: 0;
		transform-origin: left;

		height: 3px;

		background-color: var(--element-color);

		animation: progress var(--progress-duration) linear;
	}

	.progress.paused {
		animation-play-state: paused;
	}

	@keyframes progress {
		from {
			transform: scaleX(0);
		}

		to {
			transform: scaleX(1);
		}
	}
</style>
