<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { AnimatedArrowCircle } from '$lib/components/AnimatedArrowCircle';
	import { ConsecutiveFadeUpIntro } from '$lib/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$lib/components/SplitText';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { getLangContext } from '$lib/contexts/lang';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import { translations } from '../translation';

	const { routes } = getRoutingContext();

	const { lang } = getLangContext();

	$: t = translations[$lang].sponsor;
</script>

<section class="sponsors max-w-pad">
	<ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
		<a href={$routes.sponsor.path} title={t.title} class="section-title-container">
			<h2 class="c-text-h2 uppercase">
				<SplitText text={t.title} />
			</h2>
			<AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
		</a>
	</ConsecutiveFadeUpIntro>
	<p class="section-desc mt-6" use:intersect>{@html t.description}</p>
	<div use:intersect class="mt-10 space-y-16 tb:mt-[60px]">
		<ToBeAnnounced>
			<p class="text-center">
				{@html t.tba.description}
				<a href={$routes.sponsor.path} class="c-link">{t.tba.cta}</a>
			</p>
		</ToBeAnnounced>
	</div>
</section>

<style lang="postcss">
	.sponsors {
		margin-top: 80px;

		@screen tb {
			margin-top: 120px;
		}
	}
</style>
