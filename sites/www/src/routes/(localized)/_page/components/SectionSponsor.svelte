<script lang="ts">
	import { getLangContext } from '$client/contexts/lang';
	import { getNavigationContext } from '$client/contexts/navigation';
	import { intersect } from '$lib/actions/intersect';
	import { AnimatedArrowCircle } from '$lib/components/AnimatedArrowCircle';
	import { ConsecutiveFadeUpIntro } from '$lib/components/ConsecutiveFadeUpIntro';
	import { SplitText } from '$lib/components/SplitText';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import type { Sponsor } from '$shared/types';

	import { translations } from '../translation';

	export let sponsors: Sponsor[];

	const { routes } = getNavigationContext();

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].sponsor;
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
	<p class="section-desc mt-6" use:intersect>{t.description}</p>
	{#if sponsors.length}
		<ul use:intersect>
			{#each sponsors as _}
				<li class="flex items-center space-x-2 pc:space-x-4">
					<div class="c-logo c-logo--themed sp:w-[32px]" />
					<p class="c-text-h5 uppercase leading-normal">Svelte<br />Vietnam</p>
				</li>
			{/each}
		</ul>
	{:else}
		<div use:intersect class="mt-10 tb:mt-[60px]">
			<ToBeAnnounced>
				<p class="text-center">
					{t.tba.description}
					<a href={$routes.sponsor.path} class="c-link">{t.tba.cta}</a>
				</p>
			</ToBeAnnounced>
		</div>
	{/if}
</section>

<style lang="postcss">
	.sponsors {
		margin-top: 80px;

		@screen tb {
			margin-top: 120px;
		}
	}

	ul {
		display: flex;
		flex-wrap: wrap;
		gap: 24px;
		margin-top: 24px;

		@screen tb {
			gap: 40px;
			margin-top: 60px;
		}
	}
</style>
