<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import { Breadcrumbs } from '@sveltevietnam/kit/components';

	import * as m from '$data/locales/generated/messages';
	import svgChimLac from '$lib/assets/images/svg/chim-lac.svg?no-inline';
	import svgDong from '$lib/assets/images/svg/dong-thai-binh-hung-bao.svg?no-inline';
	import svgTuChu from '$lib/assets/images/svg/tu-chu.svg?no-inline';
	import svgTuNom from '$lib/assets/images/svg/tu-nom.svg?no-inline';
	import * as pagefind from '$lib/pagefind/attributes';

	import type { PageProps } from './$types';
	import { Milestone } from './_page/components/milestone';
	import environmentProtectionSvg from './_page/images/environment-protection.svg';

	let { data }: PageProps = $props();
</script>

<main {...pagefind.page({ group: 'general' })}>
	<!-- Intro -->
	<section class="pt-intro-pad-top bg-gradient-primary-intro desktop:pb-20 relative pb-10">
		<div
			class="max-w-pad max-tablet:flex-col tablet:items-start z-1 relative flex justify-between
			gap-6"
		>
			<div class="tablet:space-y-8 relative space-y-6">
				<Breadcrumbs
					crumbs={data.routing.breadcrumbs}
					i18n={{
						aria: m['components.breadcrumbs.aria'],
						home: m['components.breadcrumbs.home'],
					}}
				/>
				<div class="space-y-4">
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={m['pages.roadmap.heading']} />
					</h1>
					<p class="c-text-subtitle-page max-w-readable-relaxed">
						<T message={m['pages.roadmap.desc']} />
					</p>
				</div>
			</div>
			<img
				class="w-70 tablet:w-100 desktop:w-128 max-tablet:self-end h-auto"
				src={environmentProtectionSvg}
				width="280"
				height="280"
				alt="a human climbing a ladder, looking at milestones"
				fetchpriority="high"
				loading="eager"
			/>
		</div>
		<div class="absolute inset-0 z-0">
			<div
				class="_road bg-primary-on-surface desktop:h-118 tablet:h-81 tablet:bottom-2 h-82
				desktop:bottom-8 absolute inset-x-0 bottom-9"
			></div>
			<div
				class="desktop:w-25 bg-secondary desktop:left-16/100 desktop:top-68/100 tablet:top-80/100
				tablet:left-10/100 2xl:left-25/100 2xl:top-65/100 top-73/100 left-7/100 absolute aspect-square
				h-auto w-14 rounded-full"
			>
				<!-- large circle -->
			</div>
			<div
				class="desktop:w-14 bg-secondary desktop:left-46/100 desktop:top-50/100 tablet:left-40/100
				tablet:top-60/100 top-44/100 left-74/100 absolute aspect-square h-auto w-8 rounded-full"
			>
				<!-- small circle -->
			</div>
		</div>
	</section>

	<div class="pb-section space-y-section">
		<!-- Milestone: Đồng -->
		<Milestone
			id="dong"
			name="Đồng"
			objective={m['pages.roadmap.dong.objective']}
			highlights={[
				m['pages.roadmap.dong.highlights.v1'],
				m['pages.roadmap.dong.highlights.people_of_svelte'],
			]}
			tasks={[
				{
					message: m['pages.roadmap.dong.tasks.publish_packages'],
					progress: 'planned',
				},
				{
					message: m['pages.roadmap.dong.tasks.job_posting'],
					progress: 'planned',
				},
				{
					message: m['pages.roadmap.dong.tasks.a11y'],
					progress: 'inprogress',
				},
				{
					message: m['pages.roadmap.dong.tasks.umami'],
					progress: 'completed',
				},
				{
					message: m['pages.roadmap.dong.tasks.backend'],
					progress: 'completed',
				},
				{
					message: m['pages.roadmap.dong.tasks.people'],
					progress: 'completed',
				},
				{
					message: m['pages.roadmap.dong.tasks.read_experience'],
					progress: 'completed',
				},
				{
					message: m['pages.roadmap.dong.tasks.write_guidelines'],
					progress: 'completed',
				},
				{
					message: m['pages.roadmap.dong.tasks.home_resources'],
					progress: 'completed',
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
					progress: 'completed',
				},
			]}
			current
		>
			<div class="opacity-4 max-w-pad -z-1 top-90 tablet:top-72 absolute inset-x-0">
				<img
					class="ml-auto"
					alt="Đồng Thái Bình Hưng Bảo"
					src={svgDong}
					width="265"
					height="265"
					loading="lazy"
					decoding="async"
					fetchpriority="low"
				/>
			</div>
		</Milestone>

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
		>
			<div class="opacity-4 max-w-pad -z-1 top-94 tablet:top-80 absolute inset-x-0">
				<div class="tablet:gap-10 max-tablet:flex-col max-w-256 ml-auto flex gap-5">
					<img
						class="w-full flex-1"
						alt="Chữ"
						src={svgTuChu}
						width="211"
						height="138"
						loading="lazy"
						decoding="async"
						fetchpriority="low"
					/>
					<img
						class="w-full flex-1"
						alt="Nôm"
						src={svgTuNom}
						width="211"
						height="138"
						loading="lazy"
						decoding="async"
						fetchpriority="low"
					/>
				</div>
			</div>
		</Milestone>

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
		>
			<div class="opacity-4 max-w-pad -z-1 absolute inset-x-0 top-60">
				<img
					class="max-w-256 ml-auto h-auto w-full"
					alt="Chim Lạc"
					src={svgChimLac}
					width="375"
					height="127"
					loading="lazy"
					decoding="async"
					fetchpriority="low"
				/>
			</div>
		</Milestone>
	</div>
</main>

<style lang="postcss">
	@import '@sveltevietnam/css/medias';

	._road {
		clip-path: polygon(0% 100%, 0% 64.4%, 100% 0%, 100% 9.96%);
	}
</style>
