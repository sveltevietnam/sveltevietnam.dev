<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import * as pagefind from '$lib/pagefind/attributes';
	import { RoutingContext } from '$lib/routing/context.svelte';

	import { Milestone } from './_page/components/milestone';
	import environmentProtectionSvg from './_page/images/environment-protection.svg';

	const routing = RoutingContext.get();
</script>

<main {...pagefind.page({ group: 'general' })}>
	<!-- Intro -->
	<section class="space-y-section pt-intro-pad-top bg-gradient-primary-intro relative">
		<div
			class="max-w-pad tablet:flex-row tablet:gap-6 tablet:items-start flex flex-col justify-between"
		>
			<div class="tablet:space-y-8 relative z-30 space-y-6">
				<Breadcrumbs crumbs={routing.breadcrumbs} />
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.roadmap.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable-relaxed">
						<T message={m['pages.roadmap.desc']} />
					</p>
				</div>
			</div>
			<div class="absolute bottom-0 left-0 right-0 top-40 z-0">
				<!-- background svg -->
			</div>
			<img
				class="desktop:w-80 max-tablet:self-end relative z-20"
				src={environmentProtectionSvg}
				width="320"
				height="320"
				alt="a human climbing a ladder, looking at milestones"
				fetchpriority="high"
				loading="eager"
			/>
		</div>
	</section>

	<!-- Milestone: Đồng -->
	<Milestone
		id="dong"
		name="Đồng"
		objective={m['pages.roadmap.dong.objective']}
		tasks={[
			{
				message: m['pages.roadmap.dong.tasks.job_posting'],
				progress: 'planned',
			},
			{
				message: m['pages.roadmap.dong.tasks.post_submitInApp'],
				progress: 'planned',
			},
			{
				message: m['pages.roadmap.dong.tasks.task_md_editor'],
				progress: 'planned',
			},
			{
				message: m['pages.roadmap.dong.tasks.github_oauth'],
				progress: 'planned',
			},
			{
				message: m['pages.roadmap.dong.tasks.svelte_5'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.dong.tasks.inter_4'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.dong.tasks.tailwind_4'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.dong.tasks.refactor'],
				progress: 'inprogress',
			},
		]}
		current
	></Milestone>

	<!-- Milestone: Tự -->
	<Milestone
		id="tu"
		name="Tự"
		objective={m['pages.roadmap.tu.objective']}
		highlights={[
			m['pages.roadmap.tu.highlights.open_collective'],
			m['pages.roadmap.tu.highlights.first_offline_meetup'],
			m['pages.roadmap.tu.highlights.first_online_meetup'],
			m['pages.roadmap.tu.highlights.first_ui'],
		]}
		tasks={[
			{
				message: m['pages.roadmap.tu.tasks.survey'],
				progress: 'delayed',
			},
			{
				message: m['pages.roadmap.tu.tasks.page_jobs'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.page_design'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.progressive_enhancement'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.page_coc'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.og'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.references'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.page_blog'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.page_events'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.tu.tasks.mailer'],
				progress: 'completed',
			},
		]}
	></Milestone>

	<!-- Milestone: Âu Lạc -->
	<Milestone
		id="au-lac"
		name="Âu Lạc"
		objective={m['pages.roadmap.auLac.objective']}
		highlights={[
			m['pages.roadmap.auLac.highlights.roadmap'],
			m['pages.roadmap.auLac.highlights.initiation'],
		]}
		tasks={[
			{
				message: m['pages.roadmap.auLac.tasks.page_roadmap'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.metadata'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.discord'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.page_home'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.page_branding_repo'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.logo'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.project_reference'],
				progress: 'completed',
			},
			{
				message: m['pages.roadmap.auLac.tasks.github'],
				progress: 'completed',
			},
		]}
	></Milestone>
</main>
