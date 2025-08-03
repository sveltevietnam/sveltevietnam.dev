<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { Breadcrumbs } from '$lib/components/breadcrumbs';
	import { RoutingContext } from '$lib/routing/context.svelte';

	import backgroundSvg from './_page/images/background.svg';
	import chimhacSvg from './_page/images/chim-hac.svg';
	import chunomSvg from './_page/images/chu-nom.svg';
	import dongSvg from './_page/images/dong.svg';
	import environmentProtectionSvg from './_page/images/environment-protection.svg';

	const routing = RoutingContext.get();

	function getProgressColorStyle(
		progressMessage: (typeof m)['pages.roadmap.progress.completed'],
	): string {
		if (progressMessage === m['pages.roadmap.progress.completed']) {
			return 'color: var(--color-success-on-surface)';
		} else if (progressMessage === m['pages.roadmap.progress.delayed']) {
			return 'color: var(--color-error-on-surface)';
		} else if (progressMessage === m['pages.roadmap.progress.planned']) {
			return 'color: var(--color-on-surface-subtle)';
		} else if (progressMessage === m['pages.roadmap.progress.inprogress']) {
			return 'color: var(--color-info-on-surface)';
		}
		return '';
	}
</script>

<main>
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
				<img
					class="absolute object-cover"
					src={backgroundSvg}
					alt="roadmap with milestones"
					loading="eager"
				/>
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

	<!-- Current -->
	<section class="max-w-pad py-section space-y-10">
		<h2 class="c-text-heading-lg border-b" id="dong">
			<T message={m['pages.roadmap.common.milestone']} />: Đồng
			(<T message={m.current} />)
		</h2>
		<div class="relative bottom-0 left-0 right-0 top-40 z-0 opacity-10">
			<img
				class="absolute object-cover"
				src={dongSvg}
				alt="roadmap with milestones"
				loading="eager"
			/>
		</div>
		<div
			class="border-onehalf bg-surface shadow-brutal-lg tablet:p-8 desktop:p-10 desktop:pt-6 tablet:pt-4 max-w-readable-relaxed relative w-fit space-y-6 border-current"
		>
			<p>
				<strong><T message={m['pages.roadmap.common.objective']} /></strong>: <T
					message={m['pages.roadmap.dong.objective']}
				/>
			</p>
		</div>
		<table class="border-outline w-full border-collapse border">
			<thead>
				<tr class="bg-surface-variant text-left *:border *:px-3 *:py-2">
					<th scope="col"><T message={m['pages.roadmap.common.task']} /></th>
					<th scope="col"><T message={m['pages.roadmap.common.progress']} /></th>
				</tr>
			</thead>
			<tbody>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.job_posting']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.post_submitInApp']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.task_md_editor']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.github_oauth']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.svelte_5']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.inter_4']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.tailwind_4']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.planned'])}>
						<i class="i i-[ph--clock] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.planned']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.dong.tasks.refactor']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.inprogress'])}>
						<i class="i i-[ph--hourglass] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.inprogress']} />
					</td>
				</tr>
			</tbody>
		</table>
	</section>

	<!-- Tu -->
	<section class="max-w-pad py-section space-y-10">
		<h2 class="c-text-heading-lg border-b" id="tu">
			<T message={m['pages.roadmap.common.milestone']} />: Tự
		</h2>
		<div class="relative bottom-0 left-0 right-0 top-40 z-0 opacity-10">
			<img
				class="absolute object-cover"
				src={chunomSvg}
				alt="roadmap with milestones"
				loading="eager"
			/>
		</div>
		<div
			class="border-onehalf bg-surface shadow-brutal-lg tablet:p-8 desktop:p-10 desktop:pt-6 tablet:pt-4 max-w-readable-relaxed relative w-fit space-y-6 border-current"
		>
			<p>
				<strong><T message={m['pages.roadmap.common.objective']} /></strong>: <T
					message={m['pages.roadmap.tu.objective']}
				/>
			</p>
		</div>
		<strong><T message={m['pages.roadmap.common.highlight']} /></strong>
		<ul class="space-y-2 pt-4">
			<li>
				<i class="i i-[ph--confetti] h-6 w-6"></i>
				<T message={m['pages.roadmap.tu.highlights.open_collective']} />
			</li>
			<li>
				<i class="i i-[ph--confetti] h-6 w-6"></i>
				<T message={m['pages.roadmap.tu.highlights.first_offline_meetup']} />
			</li>
			<li>
				<i class="i i-[ph--confetti] h-6 w-6"></i>
				<T message={m['pages.roadmap.tu.highlights.first_online_meetup']} />
			</li>
			<li>
				<i class="i i-[ph--confetti] h-6 w-6"></i>
				<T message={m['pages.roadmap.tu.highlights.first_ui']} />
			</li>
		</ul>

		<table class="border-outline w-full table-auto border-collapse border">
			<thead>
				<tr class="bg-surface-variant text-left *:border *:px-3 *:py-2">
					<th scope="col" class="w-[80%]"><T message={m['pages.roadmap.common.task']} /></th>
					<th scope="col" class="w-[20%]"><T message={m['pages.roadmap.common.progress']} /></th>
				</tr>
			</thead>
			<tbody>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.survey']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.delayed'])}>
						<i class="i i-[ph--x] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.delayed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.page_jobs']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.page_design']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.progressive_enhancement']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.page_coc']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.og']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.blog_post']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.page_blog']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.page_events']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.tu.tasks.mailer']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
			</tbody>
		</table>
	</section>

	<!-- Au Lac -->
	<section class="max-w-pad py-section space-y-10">
		<h2 class="c-text-heading-lg border-b" id="auLac">
			<T message={m['pages.roadmap.common.milestone']} />: Âu Lạc
		</h2>
		<div class="relative bottom-0 left-0 right-0 top-40 z-0 opacity-10">
			<img
				class="absolute object-cover"
				src={chimhacSvg}
				alt="roadmap with milestones"
				loading="eager"
			/>
		</div>
		<div
			class="border-onehalf bg-surface shadow-brutal-lg tablet:p-8 desktop:p-10 desktop:pt-6 tablet:pt-4 max-w-readable-relaxed relative w-fit space-y-6 border-current"
		>
			<p>
				<strong><T message={m['pages.roadmap.common.objective']} /></strong>: <T
					message={m['pages.roadmap.auLac.objective']}
				/>
			</p>
		</div>
		<strong><T message={m['pages.roadmap.common.highlight']} /></strong>
		<ul class="space-y-2 pt-4">
			<li>
				<i class="i i-[ph--confetti] h-6 w-6"></i>
				<T message={m['pages.roadmap.auLac.highlights.roadmap']} />
			</li>
			<li>
				<i class="i i-[ph--confetti] h-6 w-6"></i>
				<T message={m['pages.roadmap.auLac.highlights.initiation']} />
			</li>
		</ul>

		<table class="border-outline w-full border-collapse border">
			<thead>
				<tr class="bg-surface-variant text-left *:border *:px-3 *:py-2">
					<th scope="col" class="w-[80%]"><T message={m['pages.roadmap.common.task']} /></th>
					<th scope="col" class="w-[20%]"><T message={m['pages.roadmap.common.progress']} /></th>
				</tr>
			</thead>
			<tbody>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.page_roadmap']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.metadata']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.discord']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.page_home']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.page_branding_repo']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.logo']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.project_reference']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
				<tr class="*:border *:px-3 *:py-2">
					<td>
						<T message={m['pages.roadmap.auLac.tasks.github']} />
					</td>
					<td style={getProgressColorStyle(m['pages.roadmap.progress.completed'])}>
						<i class="i i-[ph--check] h-6 w-6"></i>
						<T message={m['pages.roadmap.progress.completed']} />
					</td>
				</tr>
			</tbody>
		</table>
	</section>
</main>
