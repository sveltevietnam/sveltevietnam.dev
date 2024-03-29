<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { AnimatedArrowCircle } from '$lib/components/AnimatedArrowCircle';
	import { ConsecutiveFadeUpIntro } from '$lib/components/ConsecutiveFadeUpIntro';
	import { EventListItem } from '$lib/components/EventListItem';
	import { SplitText } from '$lib/components/SplitText';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { getLangContext } from '$lib/contexts/lang';
	import type { LocalizedEvent } from '$lib/data/events';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import { translations } from '../translation';

	export let events: LocalizedEvent[];

	const { routes } = getRoutingContext();

	const { lang } = getLangContext();

	$: t = translations[$lang].events;
</script>

<section class="events max-w-pad">
	<ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
		<a href={$routes.events.path} title={t.title} class="section-title-container">
			<h2 class=" c-text-h2 uppercase">
				<SplitText text={t.title} />
			</h2>
			<AnimatedArrowCircle class="arrow h-12 w-12 tb:h-16 tb:w-16" handle="parent" />
		</a>
	</ConsecutiveFadeUpIntro>
	<p class="section-desc mt-6" use:intersect>{t.description}</p>
	<div class="listing">
		{#if events.length}
			<ul class="space-y-10">
				{#each events as event}
					<li use:intersect>
						<EventListItem {event} />
					</li>
				{/each}
			</ul>
		{:else}
			<div use:intersect class="text-center">
				<ToBeAnnounced>
					<p>
						{t.tba.description}.
						<a href="{$routes.events.path}#mail" class="c-link">{t.tba.cta}</a>
					</p>
				</ToBeAnnounced>
			</div>
		{/if}
	</div>
</section>

<style lang="postcss">
	.events {
		position: relative;
		z-index: 2;
	}

	.listing {
		margin-top: 40px;

		@screen tb {
			margin-top: 60px;
		}
	}
</style>
