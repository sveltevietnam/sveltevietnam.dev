<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { RoutingContext } from '$lib/routing/context.svelte';
	import { SettingsContext } from '$lib/settings/context.svelte';

	import imgIntro from './_page/images/irrigation.svg?url';

	const settings = SettingsContext.get();
	const routing = RoutingContext.get();
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
					<p class="c-text-subtitle-page max-w-readable-relaxed">
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
				fetchpriority="high"
				loading="eager"
			/>
		</div>
		<IntroSeparator />
	</section>

	<!-- How -->
	<section class="py-section max-w-pad" id="how">
		<div
			class="border-onehalf bg-surface shadow-brutal-lg tablet:p-8 desktop:p-10 desktop:pt-6 tablet:pt-4 relative w-fit space-y-6 p-6 pt-4"
		>
			<h1 class="c-text-heading-lg border-b">Open Collective</h1>
			<p class="max-w-readable-relaxed leading-relaxed">
				<T message={m['pages.sponsor.highlight.desc']} />
			</p>
			<a
				class="c-btn c-btn--pop block w-fit"
				href={SOCIAL_LINKS.OPEN_COLLECTIVE}
				target="_blank"
				rel="noopener noreferrer external"
				><T message={m['pages.sponsor.highlight.cta']} />
				<i class="i i-[ph--arrow-square-out] h-6 w-6"></i></a
			>
			<p>
				<T message={m['pages.sponsor.highlight.contact']} />
				<a class="c-link" href="mailto:{EMAILS.SPONSOR}" rel="noopener noreferrer"
					>{EMAILS.SPONSOR}</a
				>.
			</p>
		</div>
	</section>

	<!-- Participate -->
	<section class="py-section max-w-pad space-y-6">
		<h1 class="c-text-heading-lg border-b">
			<T message={m['pages.sponsor.participate.heading']} />
		</h1>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.participate.desc']} />
		</p>
		<ul class="max-w-readable-relaxed flex flex-col gap-6">
			<li>
				<a
					class="c-btn c-btn--pop flex justify-between"
					href={SOCIAL_LINKS.DISCORD}
					target="_blank"
					rel="noopener noreferrer external"
					><T message={m['pages.sponsor.participate.discord']} />
					<i class="i i-[ph--arrow-square-out] h-6 w-6"></i></a
				>
			</li>
			<li>
				<a
					class="c-btn c-btn--pop flex justify-between text-left"
					href={p['/:lang/events']({ lang: settings.language })}
					><T message={m['pages.sponsor.participate.events']} /></a
				>
			</li>
			<li>
				<a
					class="c-btn c-btn--pop flex justify-between text-left"
					href={p['/:lang/blog']({ lang: settings.language })}
					><T message={m['pages.sponsor.participate.blog']} /></a
				>
			</li>
			<li>
				<a
					class="c-btn c-btn--pop flex w-full items-center justify-between"
					href={SOCIAL_LINKS.GITHUB}
					target="_blank"
					rel="noopener noreferrer external"
					><T message={m['pages.sponsor.participate.github']} />
					<i class="i i-[ph--arrow-square-out] h-6 w-6"></i></a
				>
			</li>
		</ul>
	</section>

	<!-- Why -->
	<section class="max-w-pad bg-gradient-primary py-section space-y-6" id="why">
		<h1 class="c-text-heading-lg border-b"><T message={m['pages.sponsor.why.heading']} /></h1>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.why.desc']} />
			<br /><br />
			<T message={m['pages.sponsor.why.reasons.opening']} />
		</p>
		<ul class="pl-6s max-w-readable-relaxed list-disc leading-relaxed">
			<li>
				<T message={m['pages.sponsor.why.reasons.one']} />
			</li>
			<li>
				<T message={m['pages.sponsor.why.reasons.two']} />
			</li>
		</ul>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.why.reasons.closing']} />
		</p>
	</section>

	<!-- Benefits -->
	<section class="py-section max-w-pad space-y-6">
		<h1 class="c-text-heading-lg border-b"><T message={m['pages.sponsor.benefit.heading']} /></h1>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.benefit.desc']} />
		</p>
	</section>
</main>
