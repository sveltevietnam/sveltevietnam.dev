<script lang="ts">
	import { Breadcrumbs } from '$client/components/Breadcrumbs';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { JobCard } from '$client/components/JobCard';
	import { MailRegistrationForm } from '$client/components/MailRegistrationForm';
	import { SplitText } from '$client/components/SplitText';
	import { ToBeAnnounced } from '$client/components/ToBeAnnounced';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { intersect } from '$lib/actions/intersect';

	import keyVisuals from './_page/images/key-visuals.png?enhanced';

	export let data;

	const { routes } = getNavigationContext();

	$: t = data.translations.page;
	$: tMail = data.translations.mail;
	$: ({ fromRecruitmentSites, fromSponsors } = data.jobs);
	// $: collectedTimestamp = `${fromRecruitmentSites.collectedAt.toLocaleTimeString()} - ${fromRecruitmentSites.collectedAt.toLocaleDateString()}`;
</script>

<main class="max-w-pad">
	<div class="mt-6" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>
	<section class="mb-[60px] tb:mb-16 tb:flex tb:flex-row tb:justify-between" use:intersect>
		<div class="mt-8 tb:mt-[100px] tb:max-w-[500px]">
			<h1 class="c-text-h1 uppercase">{t.title}</h1>
			<p class="c-text-h5 mt-6 leading-normal tb:mt-8">{t.subtitle}</p>
		</div>
		<div class="sp:mt-8">
			<enhanced:img
				src={keyVisuals}
				alt="hands passing suitcases through a circular band"
				class="h-auto w-full max-w-[548px]"
			/>
		</div>
	</section>
	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<section>
			<ConsecutiveFadeUpIntro selector=".char">
				<h2 class="c-text-h2 uppercase">
					<SplitText text={t.fromSponsors.title} />
				</h2>
			</ConsecutiveFadeUpIntro>

			<div class="mt-10 tb:mt-[60px]">
				{#if fromSponsors.length}
					<ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
						{#each fromSponsors as job}
							<li>
								<JobCard {job} />
							</li>
						{/each}
					</ul>
				{:else}
					<div use:intersect class="text-center">
						<ToBeAnnounced>
							<p class="c-text-h4 font-medium">
								{t.fromSponsors.tba.description}
							</p>
							<p class="mt-4">
								<a href="#sponsor" class="c-link">{t.fromSponsors.tba.cta}</a>
							</p>
						</ToBeAnnounced>
					</div>
				{/if}
			</div>
		</section>

		<section>
			<h2 class="sr-only">{t.actions.title}</h2>
			<div class="grid grid-cols-1 gap-8 tb:grid-cols-2">
				<section class="c-card-action" use:intersect id="sponsor">
					<h3 class="c-text-h3 font-medium">{t.actions.recruiter.title}</h3>
					<div class="mt-6 flex-1">
						<p>{t.actions.recruiter.description}</p>
						<ul class="mt-4 space-y-1">
							<li>1. {@html t.actions.recruiter.steps.sponsor}</li>
							<li>2. {@html t.actions.recruiter.steps.contact}</li>
						</ul>
					</div>
					<p class="mt-4 text-xs">
						<a class="c-link" href="{$routes.sponsor.path}#why">
							{t.actions.recruiter.whyNeedSponsor}
						</a>
					</p>
					<a href={$routes.sponsor.path} class="c-btn mt-4">{t.actions.recruiter.cta}</a>
				</section>
				<section class="c-card-action" use:intersect id="mail">
					<h3 class="c-text-h3 font-medium">{t.actions.candidate.title}</h3>
					<p class="mt-6 flex-1">{t.actions.candidate.description}</p>
					<MailRegistrationForm t={tMail} superValidated={data.mailForm} class="mt-6" />
				</section>
			</div>
		</section>

		<section>
			<ConsecutiveFadeUpIntro selector=".char">
				<h2 class="c-text-h2 uppercase">
					<SplitText text={t.fromRecruitmentSites.title} />
				</h2>
			</ConsecutiveFadeUpIntro>
			<p class="mt-6" use:intersect>
				<!-- {t.fromRecruitmentSites.collectedAt} {collectedTimestamp}. -->
				{@html t.fromRecruitmentSites.notice}
			</p>

			<div class="mt-10 tb:mt-[60px]">
				{#if fromRecruitmentSites.jobs.length}
					<ul class="grid grid-cols-1 gap-10 md:grid-cols-2">
						{#each fromRecruitmentSites.jobs as job}
							<li>
								<JobCard {job} />
							</li>
						{/each}
					</ul>
				{:else}
					<div use:intersect class="text-center">
						<ToBeAnnounced>
							<p class="c-text-h4 font-medium">
								{t.fromRecruitmentSites.tba.description}
							</p>
							<p class="mt-4">
								<a href="#mail" class="c-link">{t.fromRecruitmentSites.tba.cta}</a>
							</p>
						</ToBeAnnounced>
					</div>
				{/if}
			</div>
		</section>
	</div>
</main>
