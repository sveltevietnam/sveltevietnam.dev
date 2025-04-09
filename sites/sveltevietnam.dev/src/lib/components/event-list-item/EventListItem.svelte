<script lang="ts" module>
	import { T } from '@sveltevietnam/i18n';
	import type { HTMLAttributes } from 'svelte/elements';
	import type { Picture } from 'vite-imagetools';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import fallback3x2 from '$lib/assets/images/fallbacks/3x2.jpg?enhanced&w=1200,686&imagetools';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';
	import { formatLongMonth, formatLongWeekDay } from '$lib/utils/datetime';

	import { CopyIconBtn } from '../copy-icon-btn';
	import { DateTimeRangeText } from '../date-time-range-text';
	import { ListMessage } from '../list-message';

	export type EventListItemProps = HTMLAttributes<HTMLElement> & {
		event: {
			slug: string;
			title: string;
			description: string;
			location?: {
				address: string;
				googleMapUrl: string;
			}[];
			livestream?: {
				name: string;
				url: string;
			}[];
			startDate: Date;
			endDate: Date;
			thumbnail?: Picture | string;
		};
	};
</script>

<script lang="ts">
	let { event }: EventListItemProps = $props();

	const settings = SettingsContext.get();
	const routing = RoutingContext.get();

	const img = $derived(event.thumbnail ?? fallback3x2);
	const path = $derived(routing.path('events/:slug', event.slug));
</script>

<div class="@container">
	<article class="@xl:grid-cols-auto-2 @3xl:grid-cols-[auto_auto_1fr] @xl:gap-x-10 grid grid-cols-1 gap-4">
		<!-- date -->
		<div
			class={[
				'flex h-fit items-start justify-between',
				'@xl:items-end @xl:flex-col @xl:col-start-2 @xl:w-33',
				'@3xl:items-start @3xl:col-start-1',
			]}
		>
			<div class={['grid-rows-auto-2 grid-cols-auto-2 @xl:gap-y-2 grid w-fit @xl:w-full gap-x-2']}>
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
					{formatLongMonth(settings.language, event.startDate)}
				</p>
				<p
					class={[
						'@xl:col-start-1 col-start-2',
						'text-on-surface-subtle leading-tight tracking-wide',
						'@xl:leading-normal @xl:text-lg',
					]}
				>
					{formatLongWeekDay(settings.language, event.startDate)}
				</p>
			</div>

			<div class="@xl:block bg-outline mb-6 mt-4 hidden h-1 w-full"></div>

			<!-- actions -->
			<div>
				{#if settings.hydrated}
					<CopyIconBtn
						text={page.url.origin + path}
						aria={m['components.event_list_item.copy'](settings.language)}
					/>
				{/if}
			</div>
		</div>

		<!-- thumbnail -->
		<div class="@xl:@max-3xl:col-start-1 @xl:@max-3xl:row-start-1">
			<a class="c-link-image" href={path}>
				<span class="sr-only"><T message={m.view_more} /></span>
				<enhanced:img
					class="aspect-3/2 @3xl:max-w-72 h-auto"
					src={img}
					alt=""
					fetchpriority="low"
					loading="lazy"
				></enhanced:img>
			</a>
		</div>

		<!-- content -->
		<div class="@xl:col-span-2 @3xl:col-span-1 space-y-4">
			<p class={['font-lora text-xl font-bold leading-normal', '@xl:text-2xl']}>
				<a class="c-link-preserved relative" href={path}>
					{event.title}
					<i
						class="not-can-hover:hidden i i-[cursor-click] absolute bottom-0 right-0 translate-x-full text-[0.75em]"
					></i>
				</a>
			</p>
			<dl class="text-on-surface-subtle space-y-1 text-sm">
				<!-- location -->
				{#if event.location}
					<div class="flex items-start gap-2">
						<dt>
							<i class="i i-[map-pin] h-5 w-5"></i>
							<span class="sr-only"><T message={m['components.event_list_item.location']} /></span>
						</dt>
						<dd>
							<ListMessage items={event.location}>
								{#snippet item(l)}
									<a class="c-link-lazy" href={l.googleMapUrl}>{l.address}</a>
								{/snippet}
							</ListMessage>
						</dd>
					</div>
				{/if}

				<!-- livestream -->
				{#if event.livestream}
					<div class="flex items-start gap-2">
						<dt>
							<i class="i i-[television] h-5 w-5"></i>
						</dt>
						<dd>
							<span><T message={m['components.event_list_item.live']} /></span>
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
				<div class="flex items-start gap-2">
					<dt>
						<i class="i i-[clock] h-5 w-5"></i>
						<span class="sr-only"><T message={m['components.event_list_item.time']} /></span>
					</dt>
					<dd>
						<DateTimeRangeText
							startDate={event.startDate}
							endDate={event.endDate}
							order="time-first"
						/>
					</dd>
				</div>
			</dl>
			<p>{event.description}</p>
		</div>
	</article>
</div>
