<script lang="ts" module>
	import type { StackItemProps } from '@svelte-put/async-stack';
	import { T } from '@sveltevietnam/i18n';
	import { type Message, type MessageType, isMessage } from '@sveltevietnam/i18n/runtime';
	import type { Snippet } from 'svelte';
	import type { HTMLAttributes } from 'svelte/elements';

	export interface BaseNotificationProps
		extends Omit<HTMLAttributes<HTMLElement>, 'title'>,
			StackItemProps {
		title?: string | null | Snippet | Message<MessageType, never>;
		icon?: string | Snippet;
		status?: 'info' | 'success' | 'warning' | 'error';
	}

	const iconClassMap: Record<NonNullable<BaseNotificationProps['status']>, string> = {
		info: 'i-[ph--info]',
		success: 'i-[ph--check-circle]',
		warning: 'i-[ph--warning]',
		error: 'i-[ph--warning-circle]',
	};
</script>

<script lang="ts">
	let {
		item,
		title,
		icon,
		status,
		class: cls,
		children,
		...rest
	}: BaseNotificationProps = $props();

	function dismiss() {
		item?.resolve();
	}

	const iconClass = status ? iconClassMap[status] : 'i-[ph--info]';
</script>

<article
	class={['relative shadow', !status && 'border', cls]}
	role="status"
	aria-live="polite"
	aria-atomic="true"
	data-status={status}
	{...rest}
>
	<!-- x button to dismiss -->
	<button
		onclick={dismiss}
		class="absolute right-0 top-0 flex -translate-y-1/2 translate-x-1/2 cursor-pointer rounded-full
		border border-current bg-inherit p-1.5"
	>
		<i class="i i-[ph--x] h-3.5 w-3.5"></i>
		<span class="sr-only">Dismiss</span>
	</button>

	<div class="rounded-inherit relative flex items-start gap-4 overflow-hidden p-4">
		{#if typeof icon === 'function'}
			{@render icon()}
		{:else}
			<div class="i {iconClass} h-6 w-6 shrink-0"></div>
		{/if}

		<div class="w-full leading-normal">
			{#if title !== null}
				{#if isMessage(title)}
					<p class={['mb-2 border-b pb-1 font-bold', status && 'border-current']}>
						<T message={title} />
					</p>
				{:else if typeof title === 'function'}
					{@render title()}
				{:else}
					<p class={['mb-2 border-b pb-1 font-bold', status && 'border-current']}>
						{title ?? (status ? status[0].toUpperCase() + status.slice(1) : '')}
					</p>
				{/if}
			{/if}
			{#if children}
				{@render children()}
			{/if}
		</div>

		<!-- progress, (time until auto-dismiss) -->
		{#if item}
			<div
				class="progress absolute inset-x-0 bottom-0 h-0.5 origin-left overflow-hidden"
				style:--progress-duration={item.config.timeout + 'ms'}
				style:--progress-play-state={item.state === 'paused' ? 'paused' : 'running'}
				aria-disabled="true"
			></div>
		{/if}
	</div>
</article>

<style>
	article {
		--noti-color-icon: var(--color-on-surface);
		--noti-color-progress: var(--color-on-surface-subtle);
		--noti-color-bg: var(--color-surface);
		--noti-color-fg: var(--color-on-surface);

		color: var(--noti-color-fg);
		background-color: var(--noti-color-bg);

		&[data-status='info'] {
			--noti-color-icon: var(--color-info-on-surface);
			--noti-color-progress: var(--color-info-on-surface-subtle);
			--noti-color-bg: var(--color-info-surface);
			--noti-color-fg: var(--color-info-on-surface);
		}

		&[data-status='success'] {
			--noti-color-icon: var(--color-success-on-surface);
			--noti-color-progress: var(--color-success-on-surface-subtle);
			--noti-color-bg: var(--color-success-surface);
			--noti-color-fg: var(--color-success-on-surface);
		}

		&[data-status='warning'] {
			--noti-color-icon: var(--color-warning-on-surface);
			--noti-color-progress: var(--color-warning-on-surface-subtle);
			--noti-color-bg: var(--color-warning-surface);
			--noti-color-fg: var(--color-warning-on-surface);
		}

		&[data-status='error'] {
			--noti-color-icon: var(--color-error-on-surface);
			--noti-color-progress: var(--color-error-on-surface-subtle);
			--noti-color-bg: var(--color-error-surface);
			--noti-color-fg: var(--color-error-on-surface);
		}
	}

	.progress {
		background-color: var(--noti-color-progress);
		animation: progress var(--progress-duration) linear;
		animation-play-state: var(--progress-play-state);
	}

	.i {
		color: var(--noti-color-icon);
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
