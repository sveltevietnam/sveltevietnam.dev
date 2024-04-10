<script lang="ts">
	import { copy } from '@svelte-put/copy';
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';

	import { page } from '$app/stores';
	import defaultFallbackImg from '$lib/assets/images/fallback/3x2.jpg?w=1000&enhanced&imagetools';
	import { DateTimeRangeDisplayText } from '$lib/components/DateTimeRangeDisplayText';
	import { getLangContext } from '$lib/contexts/lang';
	import { getEventStatus, type LocalizedEvent } from '$lib/data/events';
	import { getRoutingContext } from '$lib/routing/routing.context';
	import { textTip } from '$lib/tooltips';
	import { formatLongMonth, formatLongWeekDay } from '$lib/utils/datetime';

	import { translations } from './translation';

	const { lang } = getLangContext();
	const { routes } = getRoutingContext();

	export let event: LocalizedEvent;
	let cls = '';
	export { cls as class };

	$: t = translations[$lang];

	$: href = `${$routes.events.path}/${event.slug}`;

	let status: ReturnType<typeof getEventStatus>;
	$: status = getEventStatus(event);

	let copyTimeoutId: ReturnType<typeof setTimeout>;
	let copied = false;
	function onCopied() {
		copied = true;
	}
	function onMouseEnterCopyButton() {
		clearTimeout(copyTimeoutId);
	}
	function onMouseLeaveCopyButton() {
		copyTimeoutId = setTimeout(() => {
			copied = false;
		}, 1800);
	}

	let hydrated = false;
	onMount(() => {
		hydrated = true;
	});
</script>

<div class="event-list-item w-full {cls}">
	<article>
		<div class="$date-and-actions">
			{#if event.startDate === 'TBA'}
				<p class="c-text-h1 font-inter font-bold leading-none">TBA</p>
			{:else}
				{@const startDate = new Date(event.startDate)}
				<div class="$date">
					<p class="$day c-text-h1 font-inter font-bold leading-none tracking-normal">
						{startDate.getDate()}
					</p>
					<p class="$month">
						{formatLongMonth($lang, startDate)}
					</p>
					<p class="$weekday">
						{formatLongWeekDay($lang, startDate)}
					</p>
				</div>
			{/if}
			<div class="$separator mb-6 mt-4 h-1 w-full bg-outline" aria-disabled />
			<div class="$actions">
				{#if hydrated}
					{#key $lang}
						<button
							class="$action-btn"
							use:textTip={{ content: t.tooltips.copyLink }}
							type="button"
							data-tooltip-placement="bottom"
							use:copy={{ text: `${$page.url.origin}${href}` }}
							on:copied={onCopied}
							on:mouseleave={onMouseLeaveCopyButton}
							on:mouseenter={onMouseEnterCopyButton}
						>
							{#if copied}
								<svg
									inline-src="lucide/clipboard-check"
									width="20"
									height="20"
									stroke-width="1.5"
									in:fly={{ duration: 200, y: 10 }}
								/>
							{:else}
								<svg
									inline-src="lucide/link"
									width="20"
									height="20"
									stroke-width="1.5"
									in:fly={{ duration: 200, y: -10 }}
								/>
							{/if}
						</button>
					{/key}
				{/if}
			</div>
		</div>
		<div class="$thumbnail">
			<a {href} class="c-link c-link--image">
				{#if event.thumbnail}
					<enhanced:img src={event.thumbnail} alt={event.title} />
				{:else}
					<enhanced:img src={defaultFallbackImg} alt={event.title} />
				{/if}
			</a>
		</div>
		<div class="$info">
			<p class="$title">
				<a {href} class="c-link c-link--preserved c-text-h4">
					<span class="font-bold">{event.title}</span>
					{#if status === 'ongoing'}
						<svg
							inline-src="lucide/radio"
							class="ml-2 inline-block h-[1em] w-[1em] animate-ping cursor-help stroke-primary"
							width="24"
							height="24"
							stroke-width="1"
							use:textTip={{ content: t.tooltips.ongoing }}
							data-tooltip-placement="top"
						/>
					{:else}
						<svg
							inline-src="lucide/mouse-pointer-click"
							class="inline-block h-[1em] w-[1em]"
							width="24"
							height="24"
							stroke-width="1"
						/>
					{/if}
				</a>
			</p>
			<div class="c-text-body2 mt-4 text-fg-200">
				<p class="flex items-start gap-2">
					<svg
						inline-src="lucide/map-pin"
						width="16"
						height="16"
						stroke-width="1.5"
						class="mt-1 shrink-0"
					/>
					<span>{@html event.location}</span>
				</p>
				<p class="flex items-start gap-2">
					<svg
						inline-src="lucide/clock"
						width="16"
						height="16"
						stroke-width="1.5"
						class="mt-1 shrink-0"
					/>
					<DateTimeRangeDisplayText
						startDate={event.startDate}
						endDate={event.endDate}
						order="time-first"
					/>
				</p>
			</div>
			<p class="mt-6">
				{@html event.description}
			</p>
		</div>
	</article>
</div>

<style lang="postcss">
	.event-list-item {
		container-name: event-list-item;
		container-type: inline-size;
	}

	article {
		display: grid;
		grid-template-areas:
			'date-and-actions'
			'thumbnail'
			'info';
		gap: theme('spacing.4');

		@container event-list-item (width > 480px) {
			grid-template-areas:
				'thumbnail date-and-actions'
				'info info';
			grid-template-columns: 1fr auto;
			column-gap: theme('spacing.8');
			align-items: flex-start;
		}

		@container event-list-item (width > 800px) {
			grid-template-areas: 'date-and-actions thumbnail info';
			grid-template-columns: auto min-content 1fr;
		}
	}

	.\$date-and-actions {
		display: flex;
		grid-area: date-and-actions;
		align-items: center;
		justify-content: space-between;

		@container event-list-item (width > 480px) {
			flex-direction: column;
			align-items: flex-end;
		}
	}

	.\$date {
		display: grid;
		grid-template-areas:
			'day month'
			'day weekday';
		grid-template-rows: auto auto;
		column-gap: theme('spacing.2');
		row-gap: theme('spacing.1');

		@container event-list-item (width > 480px) {
			grid-template-areas:
				'day month'
				'weekday month';
			grid-template-rows: auto 1fr;
			row-gap: theme('spacing.2');
		}
	}

	.\$day {
		grid-area: day;
	}

	.\$month {
		grid-area: month;

		padding-block-start: theme('spacing.1');

		font-size: 1.125rem;
		line-height: 1;
		letter-spacing: 0.025em;

		@container event-list-item (width > 480px) {
			padding-block-start: 0;
			padding-inline-start: theme('spacing.2');
			writing-mode: vertical-rl;
			font-size: 1.25rem;
		}
	}

	.\$weekday {
		grid-area: weekday;
		font-size: 0.875rem;
		line-height: 1;
		color: theme('colors.fg.200');

		@container event-list-item (width > 480px) {
			padding-inline-start: theme('spacing.1');
			font-size: 1rem;
		}
	}

	.\$separator {
		display: none;

		@container event-list-item (width > 480px) {
			display: block;
		}
	}

	.\$actions {
		/* something */
		display: flex;
		gap: theme('spacing.2');
		align-items: center;
		align-self: stretch;

		@container event-list-item (width > 480px) {
			justify-content: flex-end;
		}
	}

	.\$action-btn {
		display: grid;
		place-items: center;

		padding: theme('spacing[2.5]');

		color: theme('colors.fg.200');

		border: 1px solid currentcolor;
		border-radius: theme('borderRadius.full');

		transition: transform 200ms ease-out;

		&:hover {
			color: theme('colors.link.DEFAULT');
		}

		&:active {
			transform: scale(0.95);
		}
	}

	.\$thumbnail {
		grid-area: thumbnail;
		flex: 1;
		height: 100%;

		& img {
			aspect-ratio: 3 / 2;
			width: 100%;
			min-width: 280px;
			height: auto;
		}
	}

	.\$info {
		grid-area: info;
	}
</style>
