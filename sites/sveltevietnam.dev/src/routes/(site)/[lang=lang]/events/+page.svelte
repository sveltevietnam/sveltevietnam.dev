<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import { onScroll, createTimeline, stagger } from 'animejs';

	import { page } from '$app/state';
	import { EMAILS } from '$data/emails';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { EventListing } from '$lib/components/event-listing';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { TBA } from '$lib/components/tba';
	import { SubscriberUpsertForm } from '$lib/forms/subscriber';
	import * as pagefind from '$lib/pagefind/attributes';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import type { PageProps } from './$types';
	import imgIntro from './_page/images/eco-friendly.svg?url';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();
	const settings = SettingsContext.get();

	let elParticipate: HTMLElement;
	let elSmallCircle: SVGCircleElement;
	let elBigCircle: SVGPathElement;

	let elShare: HTMLElement;
	let elRect: SVGPathElement;

	let elSponsor: HTMLElement;
	let box1: SVGPathElement;
	let box2: SVGPathElement;
	let box3: SVGPathElement;
	let box4: SVGPathElement;
	let box5: SVGPathElement;

	$effect(() => {
		// animating circles in the participate section
		const participate = createTimeline({
			autoplay: onScroll({
				target: elParticipate,
				enter: { target: '100%', container: '90%' },
				leave: { target: '50%', container: '25%' },
				sync: 0.75,
				repeat: true,
			}),
		})
			.add(elSmallCircle, {
				x: '10rem',
			})
			.add(
				elBigCircle,
				{
					rotate: '-44.7deg',
				},
				'<<+=50',
			)
			.init();

		// animating rectangles in the share section
		const share = createTimeline({
			autoplay: onScroll({
				target: elShare,
				enter: { target: '100%', container: '90%' },
				leave: { target: '50%', container: '25%' },
				sync: 0.75,
				repeat: true,
			}),
		})
			.add(elRect, {
				x: ['-6.25rem', 0],
			})
			.init();

		// animating rectangles in the sponsor section
		const boxes = [box1, box2, box3, box4, box5];
		const sponsor = createTimeline({
			autoplay: onScroll({
				target: elSponsor,
				enter: { target: '100%', container: '90%' },
				leave: { target: '50%', container: '25%' },
				sync: 0.75,
				repeat: true,
			}),
		})
			.add(
				boxes,
				{
					x: ['-3.125rem', 0],
					opacity: [0, 1],
				},
				stagger(250, { start: '<<' }),
			)
			.init();

		return () => {
			participate.revert();
			share.revert();
			sponsor.revert();
		};
	});
</script>

{#snippet actionHeading(num: number, id: string, message: Message<'string', never>)}
	<h2 class="c-text-heading-md flex items-center gap-4 border-b pb-1" {id}>
		<span
			class="font-lora desktop:text-2xl desktop:w-10 desktop:h-10 flex h-8 w-8
			items-center justify-center rounded-full border border-current text-xl font-bold leading-normal"
			>{num}</span
		>
		<T {message} />
	</h2>
{/snippet}

<main {...pagefind.page({ group: 'events' })}>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs crumbs={routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.events.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable"><T message={m['pages.events.desc']} /></p>
				</div>
				<a class="c-btn c-btn--pop block w-fit" href="#upcoming"
					><T message={m['pages.events.view_upcoming']} /></a
				>
			</div>
			<img
				class="desktop:w-80 max-tablet:self-end h-auto w-64"
				src={imgIntro}
				width="320"
				height="320"
				alt="a human holding hand with an anthropomorphized planet earth"
				fetchpriority="high"
				loading="eager"
				decoding="sync"
			/>
		</div>
		<IntroSeparator />
	</section>

	<!-- TODO: ongoing events -->

	<!-- upcoming -->
	<section class="max-w-pad space-y-section py-section" data-pagefind-ignore>
		<h2 class="c-text-heading-lg border-b" id="upcoming">
			<T message={m['pages.events.upcoming.heading']} />
		</h2>
		<TBA class="mx-auto w-fit">
			<p class="c-text-title-sm"><T message={m['pages.events.upcoming.tba.desc']} /></p>
			<p>
				<a class="c-link" href="#participate">
					<T message={m['pages.events.upcoming.tba.subscribe']} />
				</a>
			</p>
		</TBA>
	</section>

	<!-- actions -->
	<div class="max-w-pad space-y-section-more py-section">
		<!-- participate -->
		<section
			class="tablet:items-center tablet:flex-row desktop:gap-20 flex flex-col items-center gap-10"
			bind:this={elParticipate}
		>
			<div class="flex-1 space-y-6">
				{@render actionHeading(1, 'participate', m['pages.events.participate.heading'])}
				<p class="leading-relaxed"><T message={m['pages.events.participate.desc']} /></p>
				<SubscriberUpsertForm data={data.subscribeFormData} />
				<p><T message={m['pages.events.participate.discord']} /></p>
			</div>
			<div class="flex flex-1 items-end justify-center gap-10">
				<svg
					class="text-primary h-54 desktop:h-75 w-auto"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 402 300"
				>
					<circle cx="31" cy="269.5" r="30.5" fill="currentcolor" bind:this={elSmallCircle} />
					<path
						class="relative origin-center"
						fill="currentcolor"
						d="M145.4 256A150 150 0 10103 171.2a30 30 0 1117 51 150 150 0 0025.4 33.9Z"
						bind:this={elBigCircle}
					/>
				</svg>
			</div>
		</section>

		<!-- share -->
		<section
			class="tablet:items-start tablet:flex-row-reverse desktop:gap-20 flex flex-col items-center gap-10"
			bind:this={elShare}
		>
			<div class="flex-1 space-y-6">
				{@render actionHeading(2, 'share', m['pages.events.share.heading'])}
				<p class="leading-relaxed">
					<T message={m['pages.events.share.desc']} />
					<br /><br />
					Email
					<a class="c-link" href="mailto:{EMAILS.EVENTS}" data-external>
						{EMAILS.EVENTS}
					</a>
				</p>
			</div>
			<div class="flex flex-1 justify-center">
				<svg
					class="text-primary h-50 desktop:h-75 w-auto"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 400 300"
				>
					<path fill="currentcolor" d="M300 0V120H240v60h60V300H0V0H300Z" />
					<path fill="currentcolor" d="M340 120h60v60h-60z" bind:this={elRect} />
				</svg>
			</div>
		</section>

		<!-- sponsor -->
		<section
			class="tablet:items-start tablet:flex-row desktop:gap-20 flex flex-col items-center gap-10"
			bind:this={elSponsor}
		>
			<div class="flex-1 space-y-6">
				{@render actionHeading(3, 'sponsor', m['pages.events.sponsor.heading'])}
				<p class="leading-relaxed"><T message={m['pages.events.sponsor.desc']} /></p>
				<div class="space-y-2">
					<a
						class="c-link c-text-body-xs block w-fit"
						href="{p['/:lang/sponsor']({ lang: settings.language })}#why"
					>
						<T message={m['pages.events.sponsor.why']} />
					</a>
					<a
						class="c-btn c-btn--pop block w-fit"
						href={p['/:lang/sponsor']({ lang: settings.language })}
					>
						<T message={m['pages.events.sponsor.cta']} />
					</a>
				</div>
			</div>
			<div class="flex flex-1 justify-center">
				<svg
					class="text-primary h-45.5 desktop:h-75.5 w-auto"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 235 182"
				>
					<path fill="currentcolor" d="M174.5 61h60v60h-60z" bind:this={box5} />
					<path fill="currentcolor" d="M144.5 122h60v60h-60z" bind:this={box4} />
					<path fill="currentcolor" d="M60.5 0h60v60h-60z" bind:this={box3} />
					<path fill="currentcolor" d="M30.5 61h60v60h-60z" bind:this={box2} />
					<path fill="currentcolor" d="M.5 122h60v60H.5z" bind:this={box1} />
				</svg>
			</div>
		</section>
	</div>

	<!-- past -->
	<section class="max-w-pad tablet:space-y-15 py-section space-y-8" data-pagefind-ignore>
		<h2 class="c-text-heading-lg border-b" id="past">
			<T message={m['pages.events.past.heading']} />
		</h2>
		<EventListing events={data.events} origin={page.url.origin} />
	</section>
</main>

<style lang="postcss">
	path {
		transform-box: fill-box;
	}
</style>
