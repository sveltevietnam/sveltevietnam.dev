<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { AnimatedArrowCircle } from '$lib/components/AnimatedArrowCircle';
	import { ConsecutiveFadeUpIntro } from '$lib/components/ConsecutiveFadeUpIntro';
	import { JobCard } from '$lib/components/JobCard';
	import { SplitText } from '$lib/components/SplitText';
	import { getLangContext } from '$lib/contexts/lang';
	import { getRoutingContext } from '$lib/routing/routing.context';
	import type { Job } from '$lib/types';

	import { translations } from '../translation';

	export let jobs: Job[];

	const { routes } = getRoutingContext();

	const { lang } = getLangContext();

	$: t = translations[$lang].jobs;
</script>

<section class="jobs max-w-pad">
	<ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
		<a href={$routes.jobs.path} title={t.title} class="section-title-container">
			<h2 class="c-text-h2 uppercase">
				<SplitText text={t.title} />
			</h2>
			<AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
		</a>
	</ConsecutiveFadeUpIntro>
	<p class="section-desc mt-6" use:intersect>{t.description}</p>
	<ul>
		{#each jobs as job}
			<li class="shrink-0" use:intersect>
				<JobCard {job} class="h-full" />
			</li>
		{/each}
	</ul>
</section>

<style lang="postcss">
	.jobs {
		margin-top: 80px;

		@screen tb {
			margin-top: 120px;
		}
	}

	ul {
		display: grid;
		grid-template-columns: 1fr;
		row-gap: 40px;
		column-gap: 24px;

		margin-top: 40px;

		@screen tb {
			grid-template-columns: repeat(2, 1fr);
			margin-top: 60px;
		}
	}
</style>
