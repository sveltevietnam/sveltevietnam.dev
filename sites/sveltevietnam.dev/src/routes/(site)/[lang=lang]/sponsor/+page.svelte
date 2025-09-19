<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import { EMAILS } from '$data/emails';
	import { SOCIAL_LINKS } from '$data/links';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import imgIntro from './_page/images/irrigation.svg?url';

	let { data }: PageProps = $props();

	const { routing } = Contexts.get();
</script>

<main {...pagefind.page()}>
	<!-- Intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs
					crumbs={data.routing.breadcrumbs}
					i18n={{
						aria: m['components.breadcrumbs.aria'],
						home: m['components.breadcrumbs.home'],
					}}
				/>
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
	<section class="py-section max-w-pad">
		<div
			class="border-onehalf bg-surface shadow-brutal-lg tablet:p-8 desktop:p-10 desktop:pt-6 tablet:pt-4 relative w-fit space-y-6 border-current p-6 pt-4"
		>
			<h2 class="c-text-heading-lg border-b" id="how">Open Collective</h2>
			<p class="max-w-readable-relaxed leading-relaxed">
				<T message={m['pages.sponsor.highlight.desc']} />
			</p>
			<a class="c-btn c-btn--pop block w-fit" href={SOCIAL_LINKS.OPEN_COLLECTIVE} data-external>
				<T message={m['pages.sponsor.highlight.cta']} />
				<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
			</a>
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
		<h2 class="c-text-heading-lg border-b" id="participate">
			<T message={m['pages.sponsor.participate.heading']} />
		</h2>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.participate.desc']} />
		</p>
		<ul class="max-w-readable-relaxed space-y-6">
			<li>
				<a class="c-btn c-btn--pop flex justify-between" href={SOCIAL_LINKS.DISCORD} data-external>
					<T message={m['pages.sponsor.participate.discord']} />
					<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
				</a>
			</li>
			<li>
				<a
					class="c-btn c-btn--pop flex justify-between text-left"
					href={p['/:lang/events']({ lang: routing.lang})}
				>
					<T message={m['pages.sponsor.participate.events']} />
				</a>
			</li>
			<li>
				<a
					class="c-btn c-btn--pop flex justify-between text-left"
					href={p['/:lang/blog']({ lang: routing.lang})}
				>
					<T message={m['pages.sponsor.participate.blog']} />
				</a>
			</li>
			<li>
				<a
					class="c-btn c-btn--pop flex w-full items-center justify-between"
					href={SOCIAL_LINKS.GITHUB}
					data-external
				>
					<T message={m['pages.sponsor.participate.github']} />
					<i class="i i-[ph--arrow-square-out] h-6 w-6"></i>
				</a>
			</li>
		</ul>
	</section>

	<!-- Why -->
	<section class="max-w-pad bg-gradient-primary py-section space-y-6">
		<h2 class="c-text-heading-lg border-b" id="why">
			<T message={m['pages.sponsor.why.heading']} />
		</h2>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.why.desc']} />
			<br /><br />
			<T message={m['pages.sponsor.why.reasons.opening']} />
		</p>
		<ul class="max-w-readable-relaxed list-disc pl-6 leading-relaxed">
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
		<h2 class="c-text-heading-lg border-b" id="benefits">
			<T message={m['pages.sponsor.benefit.heading']} />
		</h2>
		<p class="max-w-readable-relaxed leading-relaxed">
			<T message={m['pages.sponsor.benefit.desc']} />
		</p>
	</section>
</main>
