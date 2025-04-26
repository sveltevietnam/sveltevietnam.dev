<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message, MessageType } from '@sveltevietnam/i18n/runtime';

	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import * as m from '$data/locales/generated/messages';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { RoutingContext } from '$lib/routing/context.svelte';

	import imgIntro from './_page/images/irrigation.svg?url';

	const routing = RoutingContext.get();
	const links: { message: Message<MessageType, never>; href: string }[] = [
		{
			message: m['pages.sponsor.participate.discord'],
			href: SOCIAL_LINKS.DISCORD,
		},
		{
			message: m['pages.sponsor.participate.events'],
			href: `/${routing.paths.en ? 'en' : 'vi'}/events`,
		},
		{
			message: m['pages.sponsor.participate.blog'],
			href: `/${routing.paths.en ? 'en' : 'vi'}/blog`,
		},
		{
			message: m['pages.sponsor.participate.github'],
			href: SOCIAL_LINKS.GITHUB,
		},
	];
</script>

<main>
	<!-- Intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs crumbs={routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.sponsor.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable">
						<T message={m['pages.sponsor.desc']} />
					</p>
				</div>
			</div>
			<img
				class="desktop:w-80 max-tablet:self-end h-auto w-64"
				src={imgIntro}
				width="320"
				height="320"
				alt="a human watering the earth"
			/>
		</div>
		<IntroSeparator />
	</section>

	<!-- Donate -->
	<section class="space-y-section bg-gradient-secondary-intro py-section" id="donate">
		<div class="max-w-pad flex flex-col gap-6">
			<div class={['border-onehalf bg-surface drop-shadow-brutal relative space-y-2 px-10 py-6']}>
				<h1 class="c-text-heading-lg border-b">Open Collective</h1>
				<p class="my-6">
					<T message={m['pages.sponsor.highlight.desc']} />
				</p>
				<a class="c-btn c-btn--pop block w-fit" href={SOCIAL_LINKS.OPEN_COLLECTIVE} target="_blank"
					><T message={m['pages.sponsor.highlight.cta']} />
					<i class="i i-[ph--arrow-square-out] h-6 w-6"></i></a
				>
				<p class="my-6">
					<T message={m['pages.sponsor.highlight.contact']} />
					<a class="c-link" href="mailto:{EMAILS.SPONSOR}">{EMAILS.SPONSOR}</a>.
				</p>
			</div>
		</div>
	</section>

	<!-- Participate -->
	<section class="space-y-section py-section">
		<div class="max-w-pad flex flex-col gap-6">
			<h1 class="c-text-heading-lg border-b">
				<T message={m['pages.sponsor.participate.heading']} />
			</h1>
			<p>
				<T message={m['pages.sponsor.participate.desc']} />
			</p>
			<ul class="mobile:order-3 flex flex-col gap-6">
				{#each links as { message, href } (href)}
					<a class="c-btn c-btn--pop" {href} target="_blank">
						<span><T {message} /></span>
						<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
					</a>
				{/each}
			</ul>
		</div>
	</section>

	<!-- Why -->
	<section id="why">
		<div class="max-w-pad bg-gradient-primary pt-section pb-section-more space-y-10">
			<h1 class="c-text-heading-lg border-b"><T message={m['pages.sponsor.why.heading']} /></h1>
			<p>
				<T message={m['pages.sponsor.why.desc']} />
				<br /><br />
				<T message={m['pages.sponsor.why.reasons.opening']} />
			</p>
			<ul class="list-disc pl-6">
				<li>
					<T message={m['pages.sponsor.why.reasons.one']} />
				</li>
				<li>
					<T message={m['pages.sponsor.why.reasons.two']} />
				</li>
			</ul>
			<p>
				<T message={m['pages.sponsor.why.reasons.closing']} />
			</p>
		</div>
	</section>

	<!-- Benefits -->
	<section class="space-y-section py-section">
		<div class="max-w-pad flex flex-col gap-6">
			<h1 class="c-text-heading-lg border-b"><T message={m['pages.sponsor.benefit.heading']} /></h1>
			<p>
				<T message={m['pages.sponsor.benefit.desc']} />
			</p>
		</div>
	</section>
</main>
