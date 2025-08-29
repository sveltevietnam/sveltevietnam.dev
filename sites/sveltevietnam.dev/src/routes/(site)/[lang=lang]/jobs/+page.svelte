<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import { TBA } from '@sveltevietnam/kit/components';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';

	import { page } from '$app/state';
	import { EMAILS } from '$data/emails';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { GradientBackground } from '$lib/components/gradient-background';
	import { IntroSeparator } from '$lib/components/intro-separator';
	import { SubscriberUpsertForm } from '$lib/forms/subscriber';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import imgIntro from './_page/images/electricity.svg?url';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();
</script>

<main {...pagefind.page({ group: 'jobs' })}>
	<!-- intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 space-y-6">
				<Breadcrumbs crumbs={data.routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.jobs.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable"><T message={m['pages.jobs.desc']} /></p>
				</div>
			</div>
			<img
				class="max-tablet:self-end h-auto w-64"
				src={imgIntro}
				width="256"
				height="256"
				alt="a human holding a electrical plug"
				fetchpriority="high"
				loading="eager"
				decoding="sync"
			/>
		</div>
		<IntroSeparator />
	</section>

	<!-- posting -->
	<section class="max-w-pad py-section tablet:space-y-10 space-y-8">
		<h2 class="c-text-heading-lg border-b" id="posting">
			<T message={m['pages.jobs.posting.heading']} />
		</h2>
		<TBA class="mx-auto w-fit">
			<p class="c-text-title-sm"><T message={m['pages.jobs.posting.tba.desc']} /></p>
			<p>
				<a class="c-link" href="#recruiters">
					<T message={m['pages.jobs.posting.tba.create']} />
				</a>
			</p>
		</TBA>
	</section>

	<!-- actions -->
	<GradientBackground pattern="jigsaw">
		<div
			class="py-section bg-background max-w-pad tablet:gap-8 desktop:gap-10 flex flex-wrap gap-10"
		>
			<!-- recruiters -->
			<section
				class={[
					'border-onehalf shadow-brutal tablet:p-8 desktop:p-10 bg-surface flex min-w-80 flex-1 flex-col justify-between p-6',
					page.url.hash === '#recruiters'
						? 'border-outline-focus shadow-outline-focus'
						: 'border-current shadow-current',
				]}
			>
				<div class="space-y-6">
					<h2 class="c-text-heading border-outline border-b" id="recruiters">
						<T message={m['pages.jobs.recruiter.heading']} />
					</h2>
					<p class="leading-relaxed">
						<T message={m['pages.jobs.recruiter.desc']} />
					</p>
					<!-- <a class="c-btn c-btn--pop block w-fit" href="TODO"> -->
					<!-- 	<span> -->
					<!-- 		<T message={m['pages.jobs.recruiter.create']} /> -->
					<!-- 	</span> -->
					<!-- </a> -->
					<p>
						<T message={m['pages.jobs.recruiter.email']} />
						<a class="c-link" href="mailto:{EMAILS.JOBS}" data-external>
							{EMAILS.JOBS}
						</a>
					</p>
				</div>
				<hr class="text-outline border-outline" />
				<div class="flex flex-col items-end text-right">
					<p>
						<T message={m['pages.jobs.recruiter.sponsor.desc']} />
					</p>
					<a
						class="c-link mb-2 mt-6 block w-fit"
						href="{p['/:lang/sponsor']({ lang: routing.lang })}#why"
					>
						<T message={m['pages.jobs.recruiter.sponsor.link']} />
					</a>
					<a
						class="c-btn c-btn--pop block w-fit"
						href="{p['/:lang/sponsor']({ lang: routing.lang })}#how"
					>
						<T message={m['pages.jobs.recruiter.sponsor.cta']} />
					</a>
				</div>
			</section>

			<!-- candidates -->
			<section
				class={[
					'border-onehalf shadow-brutal tablet:p-8 desktop:p-10 bg-surface min-w-80 flex-1 space-y-6 p-6',
					page.url.hash === '#candidates'
						? 'border-outline-focus shadow-outline-focus'
						: 'border-current shadow-current',
				]}
			>
				<h2 class="c-text-heading border-b" id="candidates">
					<T message={m['pages.jobs.candidate.heading']} />
				</h2>
				<p class="leading-relaxed">
					<T message={m['pages.jobs.candidate.desc']} />
				</p>
				<SubscriberUpsertForm data={data.subscribeFormData} />
				<p>
					<T message={m['pages.jobs.candidate.discord']} />
				</p>
			</section>
		</div>
	</GradientBackground>

	<!-- scraping  -->
	<section class="max-w-pad py-section tablet:space-y-10 space-y-8">
		<div class="space-y-6">
			<h2 class="c-text-heading-lg border-b" id="scraping">
				<T message={m['pages.jobs.scraping.heading']} />
			</h2>
			<p><T message={m['pages.jobs.scraping.desc']} /></p>
		</div>
		<TBA class="mx-auto w-fit">
			<p class="c-text-title-sm"><T message={m['pages.jobs.scraping.tba.desc']} /></p>
			<p>
				<a class="c-link" href="#candidates">
					<T message={m['pages.jobs.scraping.tba.subscribe']} />
				</a>
			</p>
		</TBA>
	</section>
</main>
