<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message } from '@sveltevietnam/i18n/runtime';

	import { EMAILS } from '$data/emails';
	import * as m from '$data/locales/generated/messages';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { EventListing } from '$lib/components/event-listing';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { TBA } from '$lib/components/tba';
	import { EmailRegistrationForm } from '$lib/forms/email-registration';
	import { RoutingContext } from '$lib/routing/context.svelte';

	import imgIntro from './_page/images/eco-friendly.svg?url';

	let { data } = $props();

	const routing = RoutingContext.get();
</script>

{#snippet actionHeading(num: number, message: Message<'string', never>)}
	<h2 class="c-text-heading-md flex items-center gap-4 border-b pb-1">
		<span
			class="font-lora desktop:text-2xl desktop:w-10 desktop:h-10 flex h-8 w-8
			items-center justify-center rounded-full border border-current text-xl font-bold leading-normal"
			>{num}</span
		>
		<T {message} />
	</h2>
{/snippet}

<main>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs crumbs={data.routing.breadcrumbs} />
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
				alt=""
			/>
		</div>
		<IntroSeparator />
	</section>

	<!-- TODO: ongoing events -->

	<!-- upcoming -->
	<section class="max-w-pad space-y-section py-section" id="upcoming">
		<h2 class="c-text-heading-lg border-b">
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
			id="participate"
		>
			<div class="flex-1 space-y-6">
				{@render actionHeading(1, m['pages.events.participate.heading'])}
				<p class="leading-relaxed"><T message={m['pages.events.participate.desc']} /></p>
				<EmailRegistrationForm />
				<p><T message={m['pages.events.participate.discord']} /></p>
			</div>
			<div class="flex flex-1 items-end justify-center gap-10">
				<svg
					class="text-primary h-54 desktop:h-75 w-auto"
					xmlns="http://www.w3.org/2000/svg"
					fill="none"
					viewBox="0 0 402 300"
				>
					<circle cx="31" cy="269.5" r="30.5" fill="currentcolor" />
					<path
						fill="currentcolor"
						d="M145.4 256A150 150 0 10103 171.2a30 30 0 1117 51 150 150 0 0025.4 33.9Z"
					/>
				</svg>
			</div>
		</section>

		<!-- share -->
		<section
			class="tablet:items-start tablet:flex-row-reverse desktop:gap-20 flex flex-col items-center gap-10"
			id="share"
		>
			<div class="flex-1 space-y-6">
				{@render actionHeading(2, m['pages.events.share.heading'])}
				<p class="leading-relaxed">
					<T message={m['pages.events.share.desc']} />
					<br /><br />
					Email <a class="c-link" href="mailto:{EMAILS.EVENTS}">{EMAILS.EVENTS}</a>
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
					<path fill="currentcolor" d="M340 120h60v60h-60z" />
				</svg>
			</div>
		</section>

		<!-- sponsor -->
		<section
			class="tablet:items-start tablet:flex-row desktop:gap-20 flex flex-col items-center gap-10"
			id="sponsor"
		>
			<div class="flex-1 space-y-6">
				{@render actionHeading(3, m['pages.events.sponsor.heading'])}
				<p class="leading-relaxed"><T message={m['pages.events.sponsor.desc']} /></p>
				<div class="space-y-2">
					<a class="c-link c-text-body-xs block w-fit" href="{routing.path('sponsor')}#why">
						<T message={m['pages.events.sponsor.why']} />
					</a>
					<a class="c-btn c-btn--pop block w-fit" href={routing.path('sponsor')}>
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
					<path fill="currentcolor" d="M174.5 61h60v60h-60z" />
					<path fill="currentcolor" d="M60.5 0h60v60h-60z" />
					<path fill="currentcolor" d="M30.5 61h60v60h-60z" />
					<path fill="currentcolor" d="M144.5 122h60v60h-60z" />
					<path fill="currentcolor" d="M.5 122h60v60H.5z" />
				</svg>
			</div>
		</section>
	</div>

	<!-- past -->
	<section class="max-w-pad tablet:space-y-15 py-section space-y-8" id="past">
		<h2 class="c-text-heading-lg border-b">
			<T message={m['pages.events.past.heading']} />
		</h2>
		<EventListing events={data.events} />
	</section>
</main>
