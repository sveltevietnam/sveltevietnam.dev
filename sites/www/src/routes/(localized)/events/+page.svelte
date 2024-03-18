<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { ConsecutiveFadeUpIntro } from '$lib/components/ConsecutiveFadeUpIntro';
	import { EventListItem } from '$lib/components/EventListItem';
	import { MailRegistrationForm } from '$lib/components/MailRegistrationForm';
	import { SplitText } from '$lib/components/SplitText';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { EMAILS, SOCIAL_LINKS } from '$lib/constants';
	import { getLangContext } from '$lib/contexts/lang';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import type { PageData } from './$types';

	export let data: PageData;

	const { t } = getLangContext();
	const { routes } = getRoutingContext();

	$: tComponent = data.translations.page;
	$: tMail = data.translations.mail;
</script>

<main class="max-w-pad">
	<div class="mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>
	<section class="mb-[60px] tb:mb-16 tb:flex tb:flex-row tb:justify-between" use:intersect>
		<div class="mt-8 tb:mt-[100px] tb:max-w-[500px]">
			<h1 class="c-text-h1 uppercase">{tComponent.title}</h1>
			<p class="c-text-h4 mt-6 tb:mt-8">{tComponent.subtitle}</p>
		</div>
		<div class="sp:mt-8">
			<svg inline-src="./_page/images/key-visuals" class="h-auto w-full max-w-[548px]" />
		</div>
	</section>
	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		{#if data.events.ongoing.length}
			<section>
				<ConsecutiveFadeUpIntro selector=".char">
					<h2 class="c-text-h2 uppercase">
						<SplitText text={tComponent.ongoingEvents.title} />
					</h2>
				</ConsecutiveFadeUpIntro>
				<div class="mt-10 tb:mt-[60px]">
					<ul class="space-y-10 tb:space-y-[60px]">
						{#each data.events.ongoing as event}
							<li use:intersect>
								<EventListItem {event} />
							</li>
						{/each}
					</ul>
				</div>
			</section>
		{/if}
		<section>
			<ConsecutiveFadeUpIntro selector=".char">
				<h2 class="c-text-h2 uppercase">
					<SplitText text={tComponent.upcomingEvents.title} />
				</h2>
			</ConsecutiveFadeUpIntro>
			<div class="mt-10 tb:mt-[60px]">
				{#if data.events.upcoming.length}
					<ul class="space-y-10 tb:space-y-[60px]">
						{#each data.events.upcoming as event}
							<li use:intersect>
								<EventListItem {event} />
							</li>
						{/each}
					</ul>
				{:else}
					<div use:intersect class="text-center">
						<ToBeAnnounced>
							<p class="c-text-h4 font-medium">
								{tComponent.upcomingEvents.tba.description}
							</p>
							<p class="mt-4">
								<a href="#mail" class="c-link">{tComponent.upcomingEvents.tba.cta}</a>
							</p>
						</ToBeAnnounced>
					</div>
				{/if}
			</div>
		</section>
		<section>
			<h2 class="sr-only">{tComponent.actions.title}</h2>
			<div
				class="grid gap-8 sp:grid-rows-3 tb:grid-cols-2 tb:gap-6 tb-to-pc:grid-rows-2 pc:grid-cols-3"
			>
				<section class="c-card-action" use:intersect>
					<div class="flex items-center justify-between">
						<h3 class="c-text-h3 font-medium">{tComponent.actions.share.title}</h3>
						<svg
							width="56"
							height="41"
							viewBox="0 0 56 41"
							fill="none"
							xmlns="http://www.w3.org/2000/svg"
							class="opacity-40"
						>
							<rect x="43.3333" y="15" width="12" height="12" fill="currentcolor" />
							<path
								fill-rule="evenodd"
								clip-rule="evenodd"
								d="M40 0.5H0V40.5H40V27H28V15H40V0.5Z"
								fill="currentcolor"
							/>
						</svg>
					</div>
					<div class="mt-6 flex-1 space-y-1">
						<p>{tComponent.actions.share.description}</p>
						<p>{tComponent.actions.share.call}</p>
					</div>
					<p>
						Email
						<a href="mailto:{EMAILS.EVENTS}" class="c-link">
							{EMAILS.EVENTS}
						</a>
					</p>
				</section>
				<section class="c-card-action" use:intersect id="mail">
					<div class="flex items-center justify-between">
						<h3 class="c-text-h3 font-medium">{tComponent.actions.participate.title}</h3>
						<svg
							width="53"
							height="41"
							viewBox="0 0 53 41"
							xmlns="http://www.w3.org/2000/svg"
							class="opacity-40"
						>
							<circle cx="32.6665" cy="20.5" r="20" fill="currentcolor" />
							<circle cx="6.6665" cy="34.5" r="6" fill="currentcolor" />
						</svg>
					</div>
					<p class="mt-6 flex-1">{tComponent.actions.participate.description}</p>
					<MailRegistrationForm t={tMail} superValidated={data.mailForm} class="mt-6" />
				</section>
				<section class="c-card-action" use:intersect>
					<div class="flex items-center justify-between">
						<h3 class="c-text-h3 font-medium">{tComponent.actions.sponsor.title}</h3>
						<svg
							width="47"
							height="41"
							viewBox="0 0 47 41"
							xmlns="http://www.w3.org/2000/svg"
							class="opacity-40"
						>
							<rect
								x="0.0666504"
								y="27.1667"
								width="14.7242"
								height="13.3333"
								fill="currentcolor"
							/>
							<rect x="6.96863" y="13.8333" width="14.7242" height="13.3333" fill="currentcolor" />
							<rect x="13.8705" y="0.5" width="14.7242" height="13.3333" fill="currentcolor" />
							<rect x="25.3738" y="27.1667" width="14.7242" height="13.3333" fill="currentcolor" />
							<rect x="32.2758" y="13.8333" width="14.7242" height="13.3333" fill="currentcolor" />
						</svg>
					</div>
					<p class="mt-6 flex-1">{tComponent.actions.sponsor.description}</p>
					<p class="text-xs">
						<a class="c-link" href="{$routes.sponsor.path}#why">
							{tComponent.actions.sponsor.whyNeedSponsor}
						</a>
					</p>
					<a href={$routes.sponsor.path} class="c-btn mt-4">{tComponent.actions.sponsor.cta}</a>
				</section>
				<p
					class="self-center justify-self-center text-center sp:w-8/12 pc:col-span-3"
					use:intersect
				>
					{tComponent.actions.discord}
					<a href={SOCIAL_LINKS.DISCORD} class="c-link" external>
						{$t.common.sveltevienam} Discord
					</a>
				</p>
			</div>
		</section>
		<section>
			<ConsecutiveFadeUpIntro selector=".char">
				<h2 class="c-text-h2 uppercase">
					<SplitText text={tComponent.pastEvents.title} />
				</h2>
			</ConsecutiveFadeUpIntro>
			<div class="mt-10 tb:mt-[60px]">
				{#if data.events.past.length}
					<ul class="space-y-10 tb:space-y-[60px]">
						{#each data.events.past as event}
							<li use:intersect>
								<EventListItem {event} />
							</li>
						{/each}
					</ul>
				{:else}
					<div use:intersect class="text-center">
						<ToBeAnnounced>
							<p>
								{tComponent.pastEvents.tba}
							</p>
						</ToBeAnnounced>
					</div>
				{/if}
			</div>
		</section>
	</div>
</main>
