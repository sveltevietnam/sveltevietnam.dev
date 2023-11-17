<script lang="ts">
	import { intersect } from '$client/actions/intersect';
	import { AnimatedArrowCircle } from '$client/components/AnimatedArrowCircle';
	import { ConsecutiveFadeUpIntro } from '$client/components/ConsecutiveFadeUpIntro';
	import { EventCard } from '$client/components/EventCard';
	import { SplitText } from '$client/components/SplitText';
	import { ToBeAnnounced } from '$client/components/ToBeAnnounced';
	import { getLangContext } from '$client/contexts/lang';
	import { EVENTS_PATH } from '$shared/services/navigation';
	import type { Event } from '$shared/types';

	import { translations } from '../translation';

	export let events: Event[];

	const langStore = getLangContext();
	$: lang = $langStore;

	$: t = translations[lang].events;
</script>

<section class="events c-container-design">
	<ConsecutiveFadeUpIntro selector=":is(.arrow, .char)">
		<a href={EVENTS_PATH} title={t.title} class="section-title-container">
			<h2 class=" tp-h2 uppercase">
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
						<EventCard {event} />
					</li>
				{/each}
			</ul>
		{:else}
			<div use:intersect class="text-center">
				<ToBeAnnounced>
					<p>
						{t.tba.description}
						<a href="{EVENTS_PATH}#mail" class="c-link">{t.tba.cta}</a>
					</p>
				</ToBeAnnounced>
			</div>
		{/if}
	</div>
</section>

<style lang="postcss">
	.listing {
		margin-top: 40px;

		@screen tb {
			margin-top: 60px;
		}
	}
</style>
