<script lang="ts" module>
	import { T, type Message } from '@sveltevietnam/i18n/runtime';
	import fallback3x2 from '@sveltevietnam/kit/assets/images/fallbacks/3x2.jpg?enhanced&w=1200;700;400&imagetools';
	import { CopyBtn } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import {
		formatDateAndTime,
		formatLongMonth,
		formatLongWeekDay,
	} from '@sveltevietnam/kit/utilities/datetime';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import { DateTimeRangeText } from '../date-time-range-text';
	import { ListMessage } from '../list-message';

	export type EventListingItemProps = HTMLAttributes<HTMLElement> & {
		event: {
			href: string;
			title: string;
			description: string;
			location?: {
				name: string;
				href?: string;
			}[];
			livestream?: {
				name: string;
				url: string;
			}[];
			startDate?: Date | string;
			endDate?: Date | string;
			thumbnail?: Picture | string;
		};
		origin: string;
	};
</script>

<script lang="ts">
	let { event, origin }: EventListingItemProps = $props();

	const settings = SettingsContext.get();
	const { routing } = Contexts.get();

	const img = $derived(event.thumbnail ?? fallback3x2);
	const external = $derived(event.href.startsWith('http'));
	const path = $derived(
		external ? event.href : p['/:lang/events/:slug']({ lang: routing.lang, slug: event.href }),
	);
</script>

<div class="@container">
	<article
		class="@xl:grid-cols-auto-2 @3xl:grid-cols-[auto_auto_1fr] @xl:gap-x-10 grid grid-cols-1 gap-4"
	>
		<!-- date -->
		<div
			class={[
				'flex h-fit items-start justify-between',
				'@xl:items-end @xl:flex-col @xl:col-start-2 @xl:w-33',
				'@3xl:items-start @3xl:col-start-1',
			]}
		>
			{#if event.startDate instanceof Date}
				<div
					class={['grid-rows-auto-2 grid-cols-auto-2 @xl:gap-y-2 @xl:w-full grid w-fit gap-x-2']}
				>
					<p
						class={[
							'@xl:row-span-1 row-span-2',
							'text-5xl font-bold leading-none tracking-widest',
							'@xl:text-[4rem]',
						]}
					>
						{event.startDate.getDate().toString().padStart(2, '0')}
					</p>
					<p
						class={[
							'@xl:col-start-2 @xl:row-span-2 col-start-2',
							'text-xl leading-tight tracking-wide',
							'@xl:text-2xl @xl:[writing-mode:vertical-rl] @xl:tracking-normal',
						]}
					>
						{formatLongMonth(routing.lang, event.startDate)}
					</p>
					<p
						class={[
							'@xl:col-start-1 col-start-2',
							'text-on-surface-subtle leading-tight tracking-wide',
							'@xl:leading-normal @xl:text-lg',
						]}
					>
						{formatLongWeekDay(routing.lang, event.startDate)}
					</p>
				</div>
			{:else}
				<p class="text-5xl font-bold leading-none tracking-widest">TBA</p>
			{/if}

			<div class="@xl:block bg-outline mb-6 mt-4 hidden h-1 w-full"></div>

			<!-- actions -->
			<div>
				{#if settings.hydrated}
					<CopyBtn
						class="c-link-icon border-onehalf flex rounded-full border-current p-2"
						textToCopy={event.href.startsWith('http') ? event.href : origin + path}
						aria={m['components.event_listing_item.copy']}
					/>
				{/if}
			</div>
		</div>

		<!-- thumbnail -->
		<div class="@xl:@max-3xl:col-start-1 @xl:@max-3xl:row-start-1">
			<a
				class="c-link-image"
				href={path}
				{...external ? { target: '_blank', rel: 'noreferrer noopner external' } : {}}
			>
				<span class="sr-only"><T message={m.view_more} /></span>
				<enhanced:img
					class="aspect-3/2 @3xl:max-w-72 h-auto"
					src={img}
					alt=""
					fetchpriority="low"
					loading="lazy"
					decoding="async"
					sizes="(min-width: 52rem) 18.75rem, (min-width: 48rem) 37.5rem, 25rem"
				></enhanced:img>
			</a>
		</div>

		<!-- content -->
		<div class="@xl:col-span-2 @3xl:col-span-1 space-y-4">
			<p class={['font-lora text-xl font-bold leading-normal', '@xl:text-2xl']}>
				<a
					class="c-link-preserved relative"
					href={path}
					{...external ? { target: '_blank', rel: 'noreferrer noopner external' } : {}}
				>
					{event.title}
					<i class="not-can-hover:hidden i i-[ph--cursor-click] text-[0.75em]"></i>
				</a>
			</p>
			<dl class="text-on-surface-subtle c-text-body-sm space-y-1">
				<!-- location -->
				{#if event.location}
					<div class="flex items-start gap-2">
						<dt>
							<i class="i i-[ph--map-pin] h-5 w-5"></i>
							<span class="sr-only"><T message={m['location']} /></span>
						</dt>
						<dd>
							<ListMessage items={event.location}>
								{#snippet item(l)}
									{#if l.href}
										<a
											class="c-link-preserved"
											href={l.href}
											{...l.href.startsWith('http')
												? { target: '_blank', rel: 'noreferrer noopner external' }
												: {}}
										>
											{l.name}
										</a>
									{:else}
										<span>{l.name}</span>
									{/if}
								{/snippet}
							</ListMessage>
						</dd>
					</div>
				{/if}

				<!-- livestream -->
				{#if event.livestream}
					<div class="flex items-start gap-2">
						<dt>
							<i class="i i-[ph--television] h-5 w-5"></i>
						</dt>
						<dd>
							<span><T message={m['components.event_listing_item.live']} /></span>
							<ListMessage items={event.livestream}>
								{#snippet item(l)}
									<a class="c-link" href={l.url}>
										{l.name}
									</a>
								{/snippet}
							</ListMessage>
						</dd>
					</div>
				{/if}

				<!-- time -->
				{#snippet datetime(date: string | Date, prefix?: Message<'string', never>)}
					{#if date instanceof Date}
						{#if prefix}
							<span class="capitalize"><T message={m['from']} /></span>
						{/if}
						{formatDateAndTime(date)}
					{:else}
						{date}
					{/if}
				{/snippet}
				<div class="flex items-start gap-2">
					<dt>
						<i class="i i-[ph--clock] h-5 w-5"></i>
						<span class="sr-only"><T message={m['time']} /></span>
					</dt>
					<dd>
						{#if event.startDate && event.endDate}
							{#if event.startDate instanceof Date && event.endDate instanceof Date}
								<DateTimeRangeText
									startDate={event.startDate}
									endDate={event.endDate}
									order="time-first"
								/>
							{:else}
								{@render datetime(event.startDate)}
								<span class="mx-1">—</span>
								{@render datetime(event.endDate)}
							{/if}
						{:else if event.startDate}
							{@render datetime(event.startDate, m['from'])}
						{:else if event.endDate}
							{@render datetime(event.endDate, m['to'])}
						{:else}
							TBA
						{/if}
					</dd>
				</div>
			</dl>
			<p>{event.description}</p>
		</div>
	</article>
</div>
