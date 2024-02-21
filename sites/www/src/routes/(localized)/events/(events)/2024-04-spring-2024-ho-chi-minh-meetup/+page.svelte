<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import fallbackPrimaryImage from '$lib/assets/images/fallback/16x9.jpg?enhanced&w=1200&imagetools';
	import fallbackSecondaryImage from '$lib/assets/images/fallback/16x9.jpg?enhanced&w=900&imagetools';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { DateTimeRangeDisplayText } from '$lib/components/DateTimeRangeDisplayText';
	import { MailRegistrationForm } from '$lib/components/MailRegistrationForm';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';
	import { EMAILS, SOCIAL_LINKS } from '$lib/constants';
	import { generateTimeSlot } from '$lib/data/events';
	import { getRoutingContext } from '$lib/routing/routing.context';

	import type { PageData } from './$types';
	import ElectronicTicket from './_page/components/ElectronicTicket.svelte';

	export let data: PageData;

	const { routes } = getRoutingContext();

	$: t = data.translations.page;
	$: event = data.event;
</script>

<main>
	<section class="header relative -mt-header overflow-hidden pb-[100px] pt-header">
		<div class="max-w-pad" use:intersect>
			<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mt-6" />
		</div>
		<div class="max-w-pad mt-[80px] space-y-6" use:intersect>
			<h1 class="c-text-h1">{event.title}</h1>
			<div class="space-y-2">
				<p>
					<DateTimeRangeDisplayText startDate={event.startDate} endDate={event.endDate} />
				</p>
				<p>{event.location}</p>
			</div>
		</div>
	</section>

	<div class="mt-[20px] space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		<section class="max-w-pad">
			<div class="flex flex-col-reverse justify-center gap-8 pc:flex-row pc:items-end pc:gap-10">
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
					class="flex-1"
					name={data.name ?? undefined}
					email={data.email ?? undefined}
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

		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.timeline.title}</h2>

			<section class="c-callout c-callout--info c-callout--icon-bulb mt-10 space-y-4" use:intersect>
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
					<dd>{@html event.location}</dd>
				{/if}
			</dl>

			<ul class="timeline mt-10">
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 0, 30)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.introduction}</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 30, 90)}</p>
					<p>...</p>
					<p class="c-text-h5 font-medium">{t.tba}</p>
					<p>...</p>
				</li>
				<li class="space-y-2" use:intersect>
					<p class="c-text-body2 text-fg-200">{generateTimeSlot(event.startDate, 110, 10)}</p>
					<p class="c-text-h5 font-medium">{t.timeline.closing}</p>
				</li>
			</ul>
		</section>

		<section class="max-w-pad">
			<h2 class="c-text-h2 uppercase" use:intersect>{t.images.title}</h2>

			<div class="mt-[60px] grid gap-6 tb:grid-cols-[3fr,2fr]">
				<div class="upto-tb:contents tb:space-y-6">
					{#each new Array(2) as _}
						<figure use:intersect>
							<enhanced:img src={fallbackPrimaryImage} alt="placeholder" class="rounded-2xl" />
							<figcaption class="tp-cap1 mt-4 text-fg-200">{t.images.placeholder}</figcaption>
						</figure>
					{/each}
				</div>
				<div class="upto-tb:contents tb:space-y-6">
					{#each new Array(3) as _}
						<figure use:intersect>
							<enhanced:img src={fallbackSecondaryImage} alt="placeholder" class="rounded-2xl" />
							<figcaption class="tp-cap1 mt-4 text-fg-200">{t.images.placeholder}</figcaption>
						</figure>
					{/each}
				</div>
			</div>
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

	:global(footer:not(#fake-id)) {
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
</style>
