<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import * as globalM from '$data/locales/generated/messages';
	import vnphanquangDef from '$data/people/vnphanquang';
	import vnphanquangAvatar from '$data/people/vnphanquang/avatar.jpg?enhanced&w=400;100&imagetools';
	import * as p from '$data/routes/generated';
	import { DateTimeRangeText } from '$lib/components/date-time-range-text';
	import { EventGallery } from '$lib/components/event-gallery';
	import { EventTimeline } from '$lib/components/event-timeline';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { ListMessage } from '$lib/components/list-message';
	import { Person } from '$lib/components/person';

	import type { PageProps } from '../../../routes/(site)/[lang=lang]/events/[slug]/$types';

	import imgVideo2Thumbnail from './images/a-few-secrets-of-sveltevietnamdev.jpg?enhanced&w=1200;630&imagetools';
	import imgLivestreamMoment from './images/livestream-moment.jpg?enhanced&w=1200;630&imagetools';
	import imgOg from './images/og.jpg?enhanced&w=1200;630&imagetools';
	import imgVideo1Thumbnail from './images/state-of-sveltevietnam-2023.jpg?enhanced&w=1200;630&imagetools';
	import * as m from './locales/generated/messages';
	import { EVENT_LINKS } from './metadata';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();

	const vnphanquang = $derived(vnphanquangDef(routing.lang));
</script>

<main>
	<!-- Intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div class="tablet:space-y-8 max-w-pad space-y-6">
			<Breadcrumbs
				crumbs={data.routing.breadcrumbs}
				i18n={{
					aria: globalM['components.breadcrumbs.aria'],
					home: globalM['components.breadcrumbs.home'],
				}}
			/>
			<div class="space-y-6">
				<h1 class="c-text-heading-page text-primary-on-surface">
					{data.event.title}
				</h1>
				<p class="c-text-subtitle-page font-medium">
					<DateTimeRangeText startDate={data.event.startDate} endDate={data.event.endDate} />
				</p>
			</div>
		</div>
		<IntroSeparator />
	</section>

	<!-- Recap -->
	<section class="pb-section pt-section-more max-w-pad space-y-6">
		<h2 class="c-text-heading-lg border-b" id="recap">
			<T message={m['recap.heading']} />
		</h2>
		<div class="flex flex-wrap items-start gap-10 leading-relaxed">
			<p class="flex-5 min-w-[min(40ch,100%)]">
				<T message={m['recap.desc']} />
			</p>
			<p class="c-callout c-callout--success c-callout--icon-trophy flex-4 min-w-[min(32ch,100%)]">
				<T message={m['recap.shoutout']} />
			</p>
		</div>
		<div class="max-w-xl divide-y">
			<a class="c-link-box" href={EVENT_LINKS.STREAM}>
				<span><T message={m['links.youtube']} /></span>
			</a>
			<a class="c-link-box" href={EVENT_LINKS.DISCORD}>
				<span><T message={m['links.discord']} /></span>
			</a>
		</div>
	</section>

	<!-- Timeline -->
	<section class="py-section max-w-pad space-y-8">
		<h2 class="c-text-heading-lg border-b" id="timeline">
			<T message={m['timeline.heading']} />
		</h2>
		<dl class="space-y-2">
			<!-- livestream -->
			{#if data.event.livestream}
				<div class="flex items-start gap-2">
					<dt>
						<i class="i i-[ph--television] h-6 w-6"></i>
					</dt>
					<dd>
						<span><T message={m['timeline.live']} /></span>
						<ListMessage items={data.event.livestream}>
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
					<i class="i i-[ph--clock] h-6 w-6"></i>
				</dt>
				<dd>
					<DateTimeRangeText
						startDate={data.event.startDate}
						endDate={data.event.endDate}
						order="time-first"
					/>
				</dd>
			</div>
		</dl>

		<div class="bg-outline-dim w-full border-t border-dashed"></div>

		<EventTimeline.List>
			<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={0} numMinutes={20}>
				{#snippet heading()}
					<T message={m['timeline.introduction']} />
				{/snippet}
			</EventTimeline.Item>

			<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={20} numMinutes={20}>
				{#snippet heading()}
					<a class="c-link" href={EVENT_LINKS.VIDEO1}>
						<T message={m['timeline.videos.pretext']} />: "<T
							message={m['timeline.videos.one.title']}
						/>"
					</a>
				{/snippet}
				{#snippet content()}
					<p class="leading-relaxed">
						<T message={m['timeline.videos.one.desc']} />
					</p>
					<Person
						name={vnphanquang.name}
						avatar={vnphanquangAvatar}
						description={vnphanquang.description}
						href={p['/:lang/people/:id']({
							lang: routing.lang,
							id: 'vnphanquang',
						})}
					/>
				{/snippet}
			</EventTimeline.Item>

			<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={40} numMinutes={20}>
				{#snippet heading()}
					<T message={m['timeline.discussions.pretext']} />:
					<T message={m['timeline.discussions.one']} />
				{/snippet}
			</EventTimeline.Item>

			<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={60} numMinutes={30}>
				{#snippet heading()}
					<T message={m['timeline.discussions.pretext']} />:
					<T message={m['timeline.discussions.two']} />
				{/snippet}
			</EventTimeline.Item>

			<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={90} numMinutes={20}>
				{#snippet heading()}
					<a class="c-link" href={EVENT_LINKS.VIDEO2}>
						<T message={m['timeline.videos.pretext']} />: "<T message={m['timeline.videos.two']} />"
					</a>
				{/snippet}
				{#snippet content()}
					<Person
						name={vnphanquang.name}
						avatar={vnphanquangAvatar}
						description={vnphanquang.description}
						href={p['/:lang/people/:id']({
							lang: routing.lang,
							id: 'vnphanquang',
						})}
					/>
				{/snippet}
			</EventTimeline.Item>

			<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={110} numMinutes={10}>
				{#snippet heading()}
					<T message={m['timeline.closing']} />
				{/snippet}
			</EventTimeline.Item>
		</EventTimeline.List>
	</section>

	<!-- Images -->
	<section class="pt-section pb-section-more tablet:space-y-15 max-w-pad space-y-10">
		<h2 class="c-text-heading-lg border-b" id="images">
			<T message={m['images.heading']} />
		</h2>

		<EventGallery.Container>
			{#snippet biggerImages()}
				<EventGallery.Image src={imgOg} alt="">
					{#snippet caption()}
						<T message={m['images.event_cover_image']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgLivestreamMoment} alt="">
					{#snippet caption()}
						<T message={m['images.moment']} />
					{/snippet}
				</EventGallery.Image>
			{/snippet}

			{#snippet smallerImages()}
				<EventGallery.Image src={imgVideo1Thumbnail} alt="">
					{#snippet caption()}
						<T message={m['images.video_thumbnail']} />: "<T
							message={m['timeline.videos.one.title']}
						/>"
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgVideo2Thumbnail} alt="">
					{#snippet caption()}
						<T message={m['images.video_thumbnail']} />: "<T message={m['timeline.videos.two']} />"
					{/snippet}
				</EventGallery.Image>
			{/snippet}
		</EventGallery.Container>
	</section>
</main>
