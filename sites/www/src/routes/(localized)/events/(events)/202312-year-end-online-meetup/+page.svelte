<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { DateTimeRangeDisplayText } from '$lib/components/DateTimeRangeDisplayText';
	import { Person } from '$lib/components/Person';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { generateTimeSlot } from '$lib/data/events';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import kvImage from '../../_page/images/key-visuals-without-grid.png?format=webp&imagetools';

	import type { PageData } from './$types';
	import { EVENT_LINKS } from './_page/data';
	import imgSecretsOfSvelteVietnamDev from './_page/images/a-few-secrets-of-sveltevietnamdev.jpg?enhanced&imagetools';
	import imgLivestreamMoment from './_page/images/livestream-moment.jpg?enhanced&imagetools';
	import imgStateOfSvelteVietnam2023 from './_page/images/state-of-sveltevietnam-2023.jpg?enhanced&imagetools';

	export let data: PageData;

	const { routes } = getRoutingContext();

	$: t = data.translations.page;

	$: event = data.event;
</script>

<main class="relative overflow-hidden">
	<div class="max-w-pad" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mt-6" />
	</div>
	<div class="max-w-pad mt-[80px]" use:intersect>
		<h1 class="c-text-h1">{event.title}</h1>
		<div class="mt-6 space-y-[60px] pb-[60px]">
			<p><DateTimeRangeDisplayText startDate={event.startDate} endDate={event.endDate} /></p>
			<ul class="divider-border max-w-[548px] divide-y font-medium">
				<li>
					<a href={EVENT_LINKS.STREAM} class="c-link c-link--box" external>
						<span>{t.links.rewatch}</span>
					</a>
				</li>
				<li>
					<a href={EVENT_LINKS.DISCORD} class="c-link c-link--box" external>
						<span>{t.links.discuss}</span>
					</a>
				</li>
			</ul>
		</div>
	</div>
	<div
		use:intersect
		class="absolute top-0 -z-px mix-blend-luminosity upto-tb:left-0 tb:right-w-pad"
		aria-disabled
	>
		<img
			src={kvImage}
			class="h-auto w-[576px] max-w-none opacity-10 tb:w-[739px]"
			alt="two hands clapping"
			width="739"
			height="739"
		/>
	</div>
	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<div class="max-w-pad">
			<p use:intersect>{@html t.description}</p>
			<p use:intersect class="c-callout c-callout--success mt-8">{@html t.credit}</p>
		</div>
		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.timeline.title}</h2>
			<dl
				class="mt-6 grid grid-cols-[auto,1fr] items-center gap-2 border-b border-dashed border-outline-200 py-6"
				use:intersect
			>
				<!-- time -->
				<dt class="font-medium">{t.time}:</dt>
				<dd>
					<DateTimeRangeDisplayText startDate={event.startDate} endDate={event.endDate} />
				</dd>

				<!-- location -->
				{#if event.location.toUpperCase() !== 'TBA'}
					<dt class="font-medium">{t.location}:</dt>
					<dd class="first-letter:lowercase">{@html event.location}</dd>
				{/if}
			</dl>

			<ul class="timeline mt-10">
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 0, 20)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.introduction}</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 20, 20)}</p>
					<div class="space-y-3">
						<p class="c-text-h5 font-medium">
							<a class="c-link" href={EVENT_LINKS.VIDEO1} external
								>{t.timeline.video}: "{t.timeline.video1.title}"</a
							>
						</p>
						<p>{t.timeline.video1.about}</p>
						<Person person={event.speakers.vnphanquang} />
					</div>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 40, 20)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.discussion}: {t.timeline.discussion1}</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 60, 30)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.discussion2}</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 90, 20)}</p>
					<div class="space-y-3">
						<p class="c-text-h5 font-medium">
							<a class="c-link" href={EVENT_LINKS.VIDEO2} external
								>{t.timeline.video}: "{t.timeline.video2}"</a
							>
						</p>
						<Person person={event.speakers.vnphanquang} />
					</div>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 110, 10)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.closing}</p>
				</li>
			</ul>
		</section>

		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.sponsors.title}</h2>
			<div class="mt-[60px] text-center" use:intersect>
				<ToBeAnnounced>
					<p>
						{t.sponsors.tba.description}
						<a href={$routes.sponsor.path} class="c-link">{t.sponsors.tba.cta}</a>
					</p>
				</ToBeAnnounced>
			</div>
		</section>

		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.images.title}</h2>

			<div class="mt-[60px] grid gap-6 tb:grid-cols-[3fr,2fr]">
				<div class="upto-tb:contents tb:space-y-6">
					<figure use:intersect>
						<enhanced:img
							src={event.thumbnail}
							alt="laptop openning in dark gradient background"
							class="rounded-lg"
						/>
						<figcaption class="c-text-cap1 mt-4 text-fg-200">{t.images.cover}</figcaption>
					</figure>
					<figure use:intersect>
						<enhanced:img
							src={imgLivestreamMoment}
							alt="three community members having fun during livestream"
							class="rounded-lg border"
						/>
						<figcaption class="c-text-cap1 mt-4 text-fg-200">{t.images.moment}</figcaption>
					</figure>
				</div>
				<div class="upto-tb:contents tb:space-y-6">
					<figure use:intersect>
						<enhanced:img
							src={imgStateOfSvelteVietnam2023}
							alt="video thumbnail: State of Svelte Vietnam 2023"
							class="rounded-lg border"
						/>
						<figcaption class="c-text-cap1 mt-4 text-fg-200">
							Video thumbnail: "{t.timeline.video1.title}"
						</figcaption>
					</figure>
					<figure use:intersect>
						<enhanced:img
							src={imgSecretsOfSvelteVietnamDev}
							alt="video thumbnail: A Few Secrets of sveltevietnam.dev"
							class="rounded-lg border"
						/>
						<figcaption class="c-text-cap1 mt-4 text-fg-200">
							Video thumbnail: "{t.timeline.video2}"
						</figcaption>
					</figure>
				</div>
			</div>
		</section>
	</div>
</main>

<style lang="postcss">
	.timeline {
		--padding-left: 24px;

		padding-left: var(--padding-left);
		border-left: solid 1px theme('colors.outline.DEFAULT');

		@screen tb {
			--padding-left: 40px;
		}

		& li {
			position: relative;
			padding-block: 16px;
			padding-inline: 24px;
			border-bottom: dashed 1px theme('colors.outline.200');

			&::before {
				--size: 8px;

				content: '';

				position: absolute;
				top: calc(50% - var(--size) / 2);
				left: calc(-1 * var(--padding-left) - var(--size) / 2);

				width: var(--size);
				height: var(--size);

				background: currentcolor;
				border-radius: 50%;
			}

			&:nth-child(even) {
				background-color: color-mix(in hsl, currentcolor 5%, transparent);
			}

			@screen tb {
				padding-inline: 32px;
			}
		}
	}
</style>
