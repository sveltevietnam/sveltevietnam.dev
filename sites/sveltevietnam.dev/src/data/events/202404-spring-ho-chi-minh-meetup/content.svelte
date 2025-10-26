<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import trongnguyen24 from '$data/people/trongnguyen24';
	import trongnguyen24Avatar from '$data/people/trongnguyen24/avatar.jpg?enhanced&w=400;100&imagetools';
	import vnphanquang from '$data/people/vnphanquang';
	import vnphanquangAvatar from '$data/people/vnphanquang/avatar.jpg?enhanced&w=400;100&imagetools';
	import * as p from '$data/routes/generated';
	import { DateTimeRangeText } from '$lib/components/date-time-range-text';
	import { EventGallery } from '$lib/components/event-gallery';
	import { EventTimeline } from '$lib/components/event-timeline';
	import { FAQ } from '$lib/components/faq';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { ListMessage } from '$lib/components/list-message';
	import { Person } from '$lib/components/person';

	import type { PageProps } from '../../../routes/(site)/[lang=lang]/events/[slug]/$types';

	import dsvLogoImage from './images/designveloper_logo.webp';
	import imgEventTicket from './images/event/e-ticket.jpg?enhanced&w=1200;630&imagetools';
	import imgEventEarlyMembers from './images/event/early-members.jpeg?enhanced&w=1200;630&imagetools';
	import imgEventGroup from './images/event/group.jpg?enhanced&w=1200;630&imagetools';
	import imgEventQuizWinners from './images/event/quiz-winners.jpg?enhanced&w=1200;630&imagetools';
	import imgEventSettingsLeft from './images/event/settings-left.jpg?enhanced&w=1200;630&imagetools';
	import imgEventSettingsRight from './images/event/settings-right.jpeg?enhanced&w=1200;630&imagetools';
	import imgSharingTrongnguyen24Closing from './images/event/sharing-trongnguyen24-closing.jpg?enhanced&w=1200;630&imagetools';
	import imgSharingTrongnguyen24Opening from './images/event/sharing-trongnguyen24-opening.jpg?enhanced&w=1200;630&imagetools';
	import imgSharingVnphanquang from './images/event/sharing-vnphanquang.jpg?enhanced&w=1200;630&imagetools';
	import imgStandee from './images/event/standee.jpg?enhanced&w=1200;630&imagetools';
	import imgFooterBg from './images/footer-bg.jpg?enhanced&w=2048;1440;720&imagetools';
	import imgHeaderBg from './images/header-bg.jpg?enhanced&w=2048;1440;720&imagetools';
	import imgMiddleBg from './images/middle-bg.jpg?enhanced&w=2048;1440;720&imagetools';
	import * as m from './locales/generated/messages';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();

	const people = $derived({
		vnphanquang: {
			...vnphanquang(routing.lang),
			avatar: vnphanquangAvatar,
		},
		trongnguyen24: {
			...trongnguyen24(routing.lang),
			avatar: trongnguyen24Avatar,
		},
	});
</script>

<main id="spring-hcm-meetup-2024">
	<!-- Intro -->
	<section class="pt-intro-pad-top relative">
		<div class="absolute inset-0 z-0 overflow-hidden">
			<enhanced:img
				class="h-full w-full object-top"
				src={imgHeaderBg}
				alt="0"
				loading="eager"
				fetchpriority="high"
			/>
			<div
				class="from-primary-surface/80 to-surface absolute inset-0 bg-gradient-to-b from-20% to-90%"
			></div>
		</div>
		<div class="tablet:space-y-10 max-w-pad relative z-1 space-y-8">
			<Breadcrumbs crumbs={data.routing.breadcrumbs} />
			<div class="space-y-10">
				<h1 class="c-text-heading-page text-primary-on-surface">
					{data.event.title}
				</h1>
				<div class="c-text-subtitle-page space-y-1 font-medium">
					<p>
						<DateTimeRangeText startDate={data.event.startDate} endDate={data.event.endDate} />
					</p>
					{#if data.event.location}
						<p>
							<ListMessage items={data.event.location}>
								{#snippet item(l)}
									<a class="c-link-preserved" href={l.googleMapUrl}>{l.address}</a>
								{/snippet}
							</ListMessage>
						</p>
					{/if}
					<p>
						<T message={m['hosted_by']} />
						<a class="c-link-preserved" href="https://www.designveloper.com">
							<img src={dsvLogoImage} alt="" height="24" width="24" class="inline-block" />
							<span>Designveloper</span>
						</a>
					</p>
				</div>
			</div>
		</div>
		<IntroSeparator class="mt-section-more relative z-1" />
	</section>

	<!-- Recap -->
	<section class="pb-section pt-section-more max-w-pad relative z-1 space-y-6">
		<h2 class="c-text-heading-lg border-b" id="recap">
			<T message={m['recap.heading']} />
		</h2>
		<div class="flex flex-wrap items-start gap-10 leading-relaxed">
			<p class="min-w-[min(40ch,100%)] flex-5">
				<T message={m['recap.desc']} />
			</p>
			<p class="c-callout c-callout--success c-callout--icon-trophy min-w-[min(32ch,100%)] flex-4">
				<T message={m['recap.shoutout']} />
			</p>
		</div>
	</section>

	<!-- Timeline -->
	<div class="py-section relative z-0">
		<div class="-top-section-more -bottom-section-more absolute right-0 left-0 z-0">
			<enhanced:img
				class="h-full w-full object-cover object-right"
				src={imgMiddleBg}
				alt="0"
				loading="lazy"
				fetchpriority="low"
			/>
			<div
				class="from-surface via-surface/85 to-surface absolute inset-0 bg-gradient-to-b from-5% via-50% to-95%"
			></div>
		</div>
		<section class="max-w-pad relative z-1 space-y-8">
			<h2 class="c-text-heading-lg border-b" id="timeline">
				<T message={m['timeline.heading']} />
			</h2>
			<dl class="space-y-2">
				<!-- location -->
				{#if data.event.location}
					<div class="flex items-start gap-2">
						<dt>
							<i class="i i-[ph--map-pin] h-6 w-6"></i>
						</dt>
						<dd>
							<ListMessage items={data.event.location}>
								{#snippet item(l)}
									<a class="c-link-preserved" href={l.googleMapUrl}>{l.address}</a>
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
				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={0} numMinutes={15}>
					{#snippet heading()}
						<T message={m['timeline.intro.heading']} />
					{/snippet}
					{#snippet content()}
						<p class="leading-relaxed">
							<T message={m['timeline.intro.desc']} />
						</p>
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={15} numMinutes={25}>
					{#snippet heading()}
						<T message={m['timeline.sharings.pretext']} />: "<T
							message={m['timeline.sharings.one.title']}
						/>"
					{/snippet}
					{#snippet content()}
						<p class="leading-relaxed">
							<T message={m['timeline.sharings.one.desc']} />
						</p>
						<Person
							name={people.vnphanquang.name}
							avatar={people.vnphanquang.avatar}
							description={people.vnphanquang.description}
							href={p['/:lang/people/:id']({
								lang: routing.lang,
								id: 'vnphanquang',
							})}
						/>
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={40} numMinutes={25}>
					{#snippet heading()}
						<T message={m['timeline.sharings.pretext']} />: "<T
							message={m['timeline.sharings.two.title']}
						/>"
					{/snippet}
					{#snippet content()}
						<p class="leading-relaxed">
							<T message={m['timeline.sharings.two.desc']} />
						</p>
						<Person
							name={people.trongnguyen24.name}
							avatar={people.trongnguyen24.avatar}
							description={people.trongnguyen24.description}
							href={p['/:lang/people/:id']({
								lang: routing.lang,
								id: 'trongnguyen24',
							})}
						/>
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={65} numMinutes={15}>
					{#snippet heading()}
						<T message={m['timeline.qna.pretext']} />: "<T message={m['timeline.qna.one.title']} />"
					{/snippet}
					{#snippet content()}
						<p class="leading-relaxed">
							<T message={m['timeline.qna.one.desc']} />
						</p>
						<Person
							name={people.vnphanquang.name}
							avatar={people.vnphanquang.avatar}
							description={people.vnphanquang.description}
							href={p['/:lang/people/:id']({
								lang: routing.lang,
								id: 'vnphanquang',
							})}
						/>
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={80} numMinutes={15}>
					{#snippet heading()}
						<T message={m['timeline.break']} />
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={95} numMinutes={10}>
					{#snippet heading()}
						<T message={m['timeline.discussions.pretext']} />: "<T
							message={m['timeline.discussions.one.title']}
						/>"
					{/snippet}
					{#snippet content()}
						<p class="leading-relaxed">
							<T message={m['timeline.discussions.one.desc']} />
						</p>
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={105} numMinutes={10}>
					{#snippet heading()}
						<T message={m['timeline.discussions.two']} />
					{/snippet}
				</EventTimeline.Item>

				<EventTimeline.Item startDate={data.event.startDate} offsetMinutes={115} numMinutes={5}>
					{#snippet heading()}
						<T message={m['timeline.closing']} />
					{/snippet}
				</EventTimeline.Item>
			</EventTimeline.List>
		</section>
	</div>

	<!-- Frequently Asked Questions -->
	<section class="py-section max-w-pad relative z-1 space-y-8">
		<h2 class="c-text-heading-lg border-b" id="faq">
			<T message={m['faq.heading']} />
		</h2>
		<FAQ.List>
			<FAQ.Item question={m['faq.why_need_ticket.q']} answer={m['faq.why_need_ticket.a']} />
			<FAQ.Item question={m['faq.come_without_ticket.q']} answer={m['faq.come_without_ticket.a']} />
			<FAQ.Item question={m['faq.time_and_location.q']} answer={m['faq.time_and_location.a']} />
			<FAQ.Item question={m['faq.what_to_bring.q']} answer={m['faq.what_to_bring.a']} />
			<FAQ.Item question={m['faq.why_need_ticket.q']} answer={m['faq.why_need_ticket.a']} />
		</FAQ.List>
	</section>

	<!-- Images -->
	<section class="pt-section pb-section-more tablet:space-y-15 max-w-pad relative z-1 space-y-10">
		<h2 class="c-text-heading-lg border-b" id="images">
			<T message={m['images.heading']} />
		</h2>

		<EventGallery.Container>
			{#snippet biggerImages()}
				<EventGallery.Image src={imgEventGroup} alt="">
					{#snippet caption()}
						<T message={m['images.captions.group']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgSharingTrongnguyen24Closing} alt="">
					{#snippet caption()}
						<T message={m['images.captions.sharings.trongnguyen24.closing']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgEventSettingsLeft} alt="">
					{#snippet caption()}
						<T message={m['images.captions.settings.left']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgEventQuizWinners} alt="">
					{#snippet caption()}
						<T message={m['images.captions.quiz_winners']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgSharingVnphanquang} alt="">
					{#snippet caption()}
						<T message={m['images.captions.sharings.vnphanquang']} />
					{/snippet}
				</EventGallery.Image>
			{/snippet}

			{#snippet smallerImages()}
				<EventGallery.Image src={imgStandee} alt="">
					{#snippet caption()}
						<T message={m['images.captions.standee']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image class="overflow-hidden rounded-xl" src={imgEventTicket} alt="">
					{#snippet caption()}
						<T message={m['images.captions.ticket']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgEventSettingsRight} alt="">
					{#snippet caption()}
						<T message={m['images.captions.settings.right']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgSharingTrongnguyen24Opening} alt="">
					{#snippet caption()}
						<T message={m['images.captions.sharings.trongnguyen24.opening']} />
					{/snippet}
				</EventGallery.Image>

				<EventGallery.Image src={imgEventEarlyMembers} alt="">
					{#snippet caption()}
						<T message={m['images.captions.early_members']} />
					{/snippet}
				</EventGallery.Image>
			{/snippet}
		</EventGallery.Container>
	</section>

	<section class="py-section max-w-pad space-y-8 text-center">
		<p class="leading-relaxed">
			<T message={m['credits']} />
		</p>
		<p class="c-text-title-sm">
			<T message={m['hosted_by']} />
			<a class="c-link-preserved" href="https://www.designveloper.com">
				<img src={dsvLogoImage} alt="" height="24" width="24" class="inline-block" />
				<span>Designveloper</span>
			</a>
		</p>
	</section>
</main>

<div class="desktop:h-160 -z-px absolute right-0 bottom-0 left-0 h-200">
	<enhanced:img
		class="h-full w-full object-cover object-top"
		src={imgFooterBg}
		alt="0"
		loading="lazy"
		fetchpriority="low"
	/>
	<div
		class="from-surface dark:to-surface/90 to-surface/85 absolute inset-0 bg-gradient-to-b from-5% to-80%"
	></div>
</div>

<style lang="postcss">
	:global(body):has(#spring-hcm-meetup-2024) :global(footer) {
		background-image: none;
	}
</style>
