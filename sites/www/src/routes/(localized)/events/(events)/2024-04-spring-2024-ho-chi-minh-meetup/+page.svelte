<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import fallbackPrimaryImage from '$lib/assets/images/fallback/16x9.jpg?enhanced&w=1200&imagetools';
	import fallbackSecondaryImage from '$lib/assets/images/fallback/16x9.jpg?enhanced&w=900&imagetools';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { DateTimeRangeDisplayText } from '$lib/components/DateTimeRangeDisplayText';
	import { FrequentlyAskedQuestions } from '$lib/components/FrequentlyAskedQuestions';
	import { MailRegistrationForm } from '$lib/components/MailRegistrationForm';
	import { Person } from '$lib/components/Person';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { EMAILS, SOCIAL_LINKS } from '$lib/constants';
	import { generateTimeSlot } from '$lib/data/events';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import type { PageData } from './$types';
	import ElectronicTicket from './_page/components/ElectronicTicket.svelte';
	import dsvLogoImage from './_page/images/designveloper_logo.webp';

	export let data: PageData;

	const { routes } = getRoutingContext();

	$: t = data.translations.page;
	$: event = data.event;
</script>

<main id="spring-hcm-meetup-2024">
	<section class="header relative -mt-header overflow-hidden pb-[100px] pt-header">
		<div class="max-w-pad" use:intersect>
			<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mt-6" scrollIndicator="ellipsis" />
		</div>
		<div class="max-w-pad mt-[80px] space-y-6" use:intersect>
			<h1 class="c-text-h1">{event.title}</h1>
			<div class="space-y-2">
				<p>
					<DateTimeRangeDisplayText startDate={event.startDate} endDate={event.endDate} />
				</p>
				<p>{@html event.location}</p>
				<p>
					<span class="text-fg-100">{t.hostedBy}</span>
					<a class="c-link c-link--lazy" href="https://www.designveloper.com">
						<img
							src={dsvLogoImage}
							alt="Designveloper: realizing ideas"
							height="24"
							width="24"
							class="inline-block"
						/>
						Designveloper
					</a>
				</p>
			</div>
		</div>
	</section>

	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<section class="max-w-pad">
			<p class="c-callout c-callout--success c-callout--icon-megaphone" use:intersect>
				{@html t.ticket.description}
			</p>
			<div
				class="mt-10 flex flex-col-reverse justify-center gap-8 pc:flex-row pc:items-end pc:gap-10"
				use:intersect
			>
				<div>
					<h2 class="c-text-h3">{t.ticket.title}</h2>
					<MailRegistrationForm
						class="mt-8"
						t={t.ticket.form}
						superValidated={data.ticketForm}
						action="?/ticket"
					/>
				</div>
				<ElectronicTicket
					class="pc:basis-[632px]"
					name={data.ticket?.name ?? ''}
					email={data.ticket?.email ?? ''}
					number={data.ticket?.num ?? 0}
				/>
			</div>
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

		<section class="timeline-container max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.timeline.title}</h2>

			<section
				class="c-callout c-callout--info c-callout--icon-bulb mt-10 space-y-4"
				use:intersect
				id="become-a-speaker"
			>
				<h3 class="c-text-h4 font-medium" id="become-a-speaker">{t.proposal.title}</h3>
				<p>{t.proposal.description}</p>
				<ul class="divider-border mt-3 max-w-[548px] divide-y font-medium">
					<li>
						<a href={SOCIAL_LINKS.DISCORD} class="c-link c-link--box" external>
							<span>{t.proposal.links.discord}</span>
						</a>
					</li>
					<li>
						<a href="mailto:{EMAILS.EVENTS}" class="c-link c-link--box" external>
							<span>{t.proposal.links.email}</span>
						</a>
					</li>
				</ul>
				<p>{@html t.proposal.guidelines}</p>
			</section>

			<dl
				class="mt-6 grid grid-cols-[auto,1fr] items-baseline gap-2 border-b border-dashed border-outline-200 py-6"
				use:intersect
			>
				<!-- time -->
				<dt class="font-medium">{t.time}:</dt>
				<dd>
					<DateTimeRangeDisplayText startDate={event.startDate} endDate={event.endDate} /> ({t.tentative})
				</dd>

				<!-- location -->
				{#if event.location.toUpperCase() !== 'TBA'}
					<dt class="font-medium">{t.location}:</dt>
					<dd>{@html event.location}</dd>
				{/if}
			</dl>

			<ul class="timeline mt-10">
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 0, 30)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.introduction}</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 30, 15)}</p>
					<div class="space-y-3">
						<p class="c-text-h5 font-medium">
							{t.timeline.share}: "{t.timeline.share1.title}"
						</p>
						<p>{t.timeline.share1.about}</p>
						<Person person={event.speakers.vnphanquang} />
					</div>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 45, 45)}</p>
					<p>...</p>
					<p class="c-text-h5 font-medium">
						<a href="#become-a-speaker" class="c-link">{@html t.becomeSpeaker}</a>
					</p>
					<p>...</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 90, 20)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.discussion}</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 110, 10)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.closing}</p>
				</li>
			</ul>
		</section>

		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.faq.title}</h2>
			<div class="mt-10" use:intersect>
				<FrequentlyAskedQuestions entries={Object.values(t.faq.entries)} />
			</div>
		</section>

		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.images.title}</h2>

			<div class="mt-[60px] grid gap-6 tb:grid-cols-[3fr,2fr]">
				<div class="sp:contents tb:space-y-6">
					{#each new Array(2) as _}
						<figure use:intersect>
							<enhanced:img src={fallbackPrimaryImage} alt="placeholder" class="rounded-2xl" />
							<figcaption class="tp-cap1 mt-4 text-fg-200">{t.images.placeholder}</figcaption>
						</figure>
					{/each}
				</div>
				<div class="sp:contents tb:space-y-6">
					{#each new Array(3) as _}
						<figure use:intersect>
							<enhanced:img src={fallbackSecondaryImage} alt="placeholder" class="rounded-2xl" />
							<figcaption class="tp-cap1 mt-4 text-fg-200">{t.images.placeholder}</figcaption>
						</figure>
					{/each}
				</div>
			</div>
		</section>

		<section class="max-w-pad" use:intersect>
			<p class="text-center font-lora text-xl">
				<span class="text-fg-100">{t.hostedBy}</span>
				<a class="c-link c-link--lazy" href="https://www.designveloper.com">
					<img
						src={dsvLogoImage}
						alt="Designveloper: realizing ideas"
						height="40"
						width="40"
						class="inline-block"
					/>
					Designveloper
				</a>
			</p>
			<p class="mt-6 text-center text-fg-100">
				{t.imageCredit} <a class="c-link" href="https://unsplash.com/@taanhuyn">Taan Huyn</a>
			</p>
		</section>
	</div>
</main>

<style lang="postcss">
	.header {
		--gradient: linear-gradient(
			to bottom,
			theme('colors.grayscale.white / 80%'),
			theme('colors.grayscale.white / 80%') 60%,
			theme('colors.grayscale.white')
		);

		background-image: var(--gradient), url('./_page/images/header-bg.jpg');
		background-repeat: no-repeat;
		background-position: top center;
		background-size: cover;

		@dark global {
			--gradient: linear-gradient(
				to bottom,
				theme('colors.grayscale.black / 80%'),
				theme('colors.grayscale.black / 80%') 60%,
				theme('colors.grayscale.black')
			);
		}
	}

	:global(body):has(#spring-hcm-meetup-2024) :global(footer) {
		background-color: transparent;

		&::before {
			content: none;
		}

		&::after {
			--gradient: linear-gradient(
				to top,
				theme('colors.grayscale.white / 80%'),
				theme('colors.grayscale.white / 80%') 60%,
				theme('colors.grayscale.white')
			);

			content: '';

			position: absolute;
			z-index: -1;
			top: -200px;
			right: 0;
			bottom: 0;
			left: 0;

			background-image: var(--gradient), url('./_page/images/footer-bg.jpg');
			background-repeat: no-repeat;
			background-position: top center;
			background-size: cover;

			@dark global {
				--gradient: linear-gradient(
					to top,
					theme('colors.grayscale.black / 90%'),
					theme('colors.grayscale.black / 90%') 60%,
					theme('colors.grayscale.black')
				);
			}
		}
	}

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

	.timeline-container {
		position: relative;

		&::before {
			--gradient: linear-gradient(
				to bottom,
				theme('colors.grayscale.white'),
				theme('colors.grayscale.white / 92%') 20%,
				theme('colors.grayscale.white / 92%') 80%,
				theme('colors.grayscale.white')
			);

			content: '';

			position: absolute;
			z-index: -1;
			top: -200px;
			right: 0;
			bottom: -200px;
			left: 0;

			background-image: var(--gradient), url('./_page/images/middle-bg.jpg');
			background-repeat: no-repeat;
			background-position: right center;
			background-size: cover;

			@dark global {
				--gradient: linear-gradient(
					to bottom,
					theme('colors.grayscale.black'),
					theme('colors.grayscale.black / 90%') 20%,
					theme('colors.grayscale.black / 90%') 80%,
					theme('colors.grayscale.black')
				);
			}

			@screen tb {
				top: -400px;
				bottom: -400px;
			}
		}
	}
</style>
