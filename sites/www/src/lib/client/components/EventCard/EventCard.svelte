<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import { textTip } from '$client/tooltips';
	import defaultFallbackImg from '$shared/assets/images/fallback/default.webp';
	import sponsorFallbackImg from '$shared/assets/images/fallback/sponsor.webp';
	import type { LocalizedEvent } from '$shared/data/events';
	import { getEventStatus } from '$shared/data/events/helpers';
	import { EVENTS_PATH } from '$shared/services/navigation';
	import { formatDate } from '$shared/utils/datetime';

	import { translations } from './translation';

	export let event: LocalizedEvent;
	let cls = '';
	export { cls as class };

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang];
	$: status = getEventStatus(event);
	// $: monthFormatter = new Intl.DateTimeFormat(lang, { month: 'long' });

	function formatTimeStr(event: LocalizedEvent) {
		const { startDate, endDate } = event;
		const start = new Date(startDate);
		const startYear = start.getFullYear();
		const startMonth = start.getMonth() + 1;
		const startDay = start.getDate();
		const startHour = start.getHours().toString().padStart(2, '0');
		const startMinute = start.getMinutes().toString().padStart(2, '0');

		const end = new Date(endDate);
		const endYear = end.getFullYear();
		const endMonth = end.getMonth() + 1;
		const endDay = end.getDate();
		const endHour = end.getHours().toString().padStart(2, '0');
		const endMinute = end.getMinutes().toString().padStart(2, '0');

		if (startYear === endYear && startMonth === endMonth && startDay === endDay) {
			return `${startHour}:${startMinute} - ${endHour}:${endMinute}`;
		} else if (startYear !== endYear) {
			return `${startYear}-${startMonth.toString().padStart(2, '0')}-${startDay
				.toString()
				.padStart(2, '0')} ${startHour}:${startMinute} - ${endYear}-${endMonth
				.toString()
				.padStart(2, '0')}-${endDay.toString().padStart(2, '0')} ${endHour}:${endMinute}`;
		} else {
			return `${startMonth.toString().padStart(2, '0')}-${startDay
				.toString()
				.padStart(2, '0')} ${startHour}:${startMinute} - ${endMonth
				.toString()
				.padStart(2, '0')}-${endDay.toString().padStart(2, '0')} ${endHour}:${endMinute}`;
		}
	}
</script>

<article class="event-card {cls}">
	<p class="date tp-h4 flex items-center font-lora font-medium">
		{#if event.startDate === 'TBA'}
			<p>TBA</p>
		{:else}
			{@const rStartDate = new Date(event.startDate)}
			<time datetime={rStartDate.toISOString()}>{formatDate(rStartDate)}</time>
		{/if}
	</p>
	<div class="flex-1">
		<p>
			<a
				href={`${EVENTS_PATH}/${event.slug}`}
				class="c-link c-link--preserved tp-h4 font-medium"
				id={event.slug}
			>
				{event.title}
			</a>
			{#if status === 'ongoing'}
				<svg
					inline-src="google/campaign"
					width="32"
					height="32"
					class="inline-block cursor-help fill-amber align-bottom"
					use:textTip={{ content: 'This event is happening right now. Join us!' }}
				/>
			{/if}
		</p>
		<p class="mt-6">
			{@html event.description}
		</p>
		<dl class="mt-4 grid grid-cols-[auto,1fr] items-center gap-x-6 gap-y-3">
			<dt class="font-medium">{t.location}:</dt>
			<dd>
				{@html event.location}
			</dd>

			<dt class="font-medium">{t.time}:</dt>
			<dd>
				{#if event.startDate === 'TBA'}
					<p>TBA</p>
				{:else}
					{@const rStartDate = new Date(event.startDate)}
					<time datetime={rStartDate.toISOString()}>{formatTimeStr(event)}</time>
				{/if}
			</dd>

			{#if event.speakers.length}
				<dt class="font-medium">{t.speakers}:</dt>
				<dd>
					<ul class="flex flex-wrap items-center gap-x-4 gap-y-3">
						{#each event.speakers as { avatarUrl, name, link }}
							<li class="flex items-center gap-2">
								{#if link}
									<a href={link} class="c-link c-link--image" external>
										<span class="sr-only">{name}</span>
										<img
											src={avatarUrl || defaultFallbackImg}
											width="24"
											height="24"
											alt={name}
											class="c-avatar c-avatar--sm"
										/>
									</a>
								{:else}
									<img
										src={avatarUrl || defaultFallbackImg}
										width="24"
										height="24"
										alt={name}
										class="c-avatar c-avatar--sm"
									/>
								{/if}
								<p>
									{#if link}
										<a href={link} class="c-link c-link--preserved" external>
											{name}
										</a>
									{:else}
										{name}
									{/if}
								</p>
							</li>
						{/each}
					</ul>
				</dd>
			{/if}

			{#if event.sponsors.length}
				<dt class="font-medium">{t.sponsors}:</dt>
				<dd>
					<ul class="flex flex-wrap items-center gap-x-4 gap-y-3">
						{#each event.sponsors as { href, image, name }}
							<li>
								<svelte:element this={href ? 'a' : 'div'} {href} class="flex items-center gap-x-2">
									<img src={image || sponsorFallbackImg} width="24" height="24" alt={name} />
									<p>{name}</p>
								</svelte:element>
							</li>
						{/each}
					</ul>
				</dd>
			{/if}
		</dl>
	</div>
</article>

<style lang="postcss">
	.event-card {
		display: flex;
		align-items: flex-start;

		@screen sp {
			flex-direction: column;
			row-gap: 24px;
		}

		@screen tb {
			column-gap: clamp(50px, 10%, 118px);
			justify-content: space-between;
		}
	}

	.date {
		& :global(svg) {
			--animated-color: theme('colors.grayscale.600');

			width: 18px;
			height: 18px;
			margin-left: 4px;

			@screen tb {
				width: 32px;
				height: 32px;
				margin-left: 8px;
			}
		}
	}
</style>
