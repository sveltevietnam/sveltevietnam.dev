<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import fallback1x1 from '@sveltevietnam/kit/assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';
	import { Breadcrumbs, CopyBtn } from '@sveltevietnam/kit/components';
	import { SOCIAL_LINKS } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { DialogQrCode } from '@sveltevietnam/kit/dialogs';
	import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
	import sanitizeHtml from 'sanitize-html';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { VITE_PUBLIC_RECRUIT_ORIGIN } from '$env/static/public';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const { routing, dialogs, colorScheme } = Contexts.get();

	let url = $derived(page.url.origin + routing.paths[routing.lang]);
	const applicationLink = $derived(
		data.posting.applicationMethod === 'email'
			? `mailto:${data.posting.applicationLink}`
			: data.posting.applicationLink,
	);

	function openQrDialog() {
		dialogs.push('custom', {
			component: DialogQrCode,
			props: {
				data: url,
				theme: () => colorScheme.resolved,
				i18n: {
					close: m.close,
					title: m['dialogs.qr.title'],
					desc: m['dialogs.qr.desc'],
					download: m.download,
				},
			},
		});
	}
</script>

<main
	class="max-w-pad mt-header pt-section pb-section-more tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6"
>
	<Breadcrumbs
		crumbs={data.routing.breadcrumbs}
		i18n={{
			aria: m['components.breadcrumbs.aria'],
			home: m['components.breadcrumbs.home'],
		}}
	/>

	<div class="desktop:flex-row gap-section desktop:gap-20 flex flex-col">
		<!-- main content -->
		<div class="max-w-readable-relaxed flex-1 space-y-6">
			<h1 class="c-text-heading font-bold">
				{data.posting.title}
			</h1>

			<div class="border-outline border p-4">
				<h2 class="sr-only">
					<T message={m['pages.jobs_id.general.heading']} />
				</h2>

				<!-- general information -->
				<section
					class="tablet:flex-row flex flex-col-reverse items-start justify-between gap-4 space-y-6"
				>
					<dl class="grid grid-cols-[auto_1fr] gap-4">
						<!-- employer -->
						<dt>
							<i class="i i-[ph--buildings] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['pages.jobs_id.general.employerName']} />
							</span>
						</dt>
						<dd class="font-medium">
							{#if data.posting.employer.website}
								<a class="c-link-preserved" href={data.posting.employer.website} data-external>
									{data.posting.employer.name}
								</a>
							{:else}
								{data.posting.employer.name}
							{/if}
						</dd>

						<!-- type -->
						<dt>
							<i class="i i-[ph--suitcase] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['pages.jobs_id.general.type']} />
							</span>
						</dt>
						<dd>
							{data.posting.type}
						</dd>

						<!-- location -->
						<dt>
							<i class="i i-[ph--map-pin] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['pages.jobs_id.general.location']} />
							</span>
						</dt>
						<dd>
							{data.posting.location}
						</dd>

						<!-- salary -->
						<dt>
							<i class="i i-[ph--money] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['pages.jobs_id.general.salary']} />
							</span>
						</dt>
						<dd>
							{data.posting.salary}
						</dd>

						{#if data.posting.approvedAt}
							<!-- publication date -->
							<dt>
								<i class="i i-[ph--calendar-blank] h-6 w-6"></i>
							</dt>
							<dd>
								<T message={m['pages.jobs_id.general.posted_at']} />
								{formatDate(data.posting.approvedAt)}
							</dd>
						{/if}

						<!-- expiration date -->
						<dt>
							<i class="i i-[ph--calendar-x] h-6 w-6"></i>
						</dt>
						<dd>
							<T message={m['pages.jobs_id.general.expired_at']} />
							{formatDate(data.posting.expiredAt)}
						</dd>
					</dl>
					<div class="tablet:items-end flex shrink-0 flex-col justify-between gap-4 self-stretch">
						<!-- image -->
						{#snippet imageContent()}
							{@const classes = 'tablet:h-31 aspect-square h-20 w-auto'}
							{#if data.posting.employer.image}
								<img
									class={classes}
									width="80"
									height="80"
									src={data.posting.employer.image}
									alt=""
								/>
							{:else}
								<enhanced:img
									class="tablet:h-31 aspect-square h-20 w-auto"
									src={fallback1x1}
									alt=""
								/>
							{/if}
						{/snippet}
						{#if data.posting.employer.website}
							<a class="c-link-image" href={data.posting.employer.website} aria-hidden="true">
								{@render imageContent()}
							</a>
						{:else}
							<div aria-hidden="true">
								{@render imageContent()}
							</div>
						{/if}
					</div>
				</section>

				<!-- actions -->
				<section class="flex flex-wrap gap-4">
					<!-- apply -->
					<a
						class="c-btn block flex-1 border-orange-600 bg-orange-600 font-bold text-gray-50"
						href={applicationLink}
						data-external
						data-umami-event="click-apply-link"
					>
						<T message={m['pages.jobs_id.actions.apply']} />
					</a>

					<!-- copy link -->
					<CopyBtn
						class="c-btn c-btn--outlined shrink-0 grid-cols-1 p-2"
						aria={m['pages.jobs_id.actions.share.link']}
						textToCopy={url}
						data-umami-event="copy-link"
						data-umami-event-resource="job-posting"
					/>

					<!-- generate QR -->
					<button
						class="c-btn c-btn--outlined shrink-0 grid-cols-1 p-2"
						type="button"
						onclick={openQrDialog}
						data-umami-event="generate-qr"
						data-umami-event-resource="job-posting"
					>
						<span class="sr-only"><T message={m['pages.jobs_id.actions.share.qr']} /></span>
						<i class="i i-[ph--qr-code] h-6 w-6"></i>
					</button>
				</section>
			</div>

			<div class="space-y-section pt-10">
				<!-- job description -->
				<section class="space-y-6">
					<h2 class="c-text-heading border-b">
						<T message={m['pages.jobs_id.job_desc']} />
					</h2>
					<div class="prose max-w-full">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html sanitizeHtml(data.posting.description, { allowedClasses: { p: [/callout/] } })}
					</div>
				</section>

				<!-- employer description -->
				{#if data.posting.employer && data.posting.employer.description}
					<section class="space-y-6">
						<h2 class="c-text-heading border-b">
							<T
								message={m['pages.jobs_id.employer_desc']}
								employerName={data.posting.employer.name}
							/>
						</h2>
						<div class="prose max-w-full">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html sanitizeHtml(data.posting.employer.description, {
								allowedClasses: { p: [/callout/] },
							})}
						</div>
					</section>
				{/if}
			</div>
		</div>

		<!-- sidebar -->
		<div
			class="desktop:self-start desktop:sticky desktop:top-header max-w-readable-relaxed
			desktop:max-w-96 space-y-section h-fit"
		>
			<!-- Connect -->
			<section class="space-y-6">
				<h2 class="border-outline c-text-heading border-b">
					<T message={m['pages.jobs_id.connect.heading']} />
				</h2>
				<p class="leading-relaxed">
					<T
						message={m['pages.jobs_id.connect.desc']}
						linkDiscord={SOCIAL_LINKS.DISCORD}
						linkLinkedin={SOCIAL_LINKS.LINKEDIN}
					/>
				</p>
			</section>

			<!-- Contribute -->
			<section class="space-y-6">
				<h2 class="border-outline c-text-heading border-b">
					<T message={m['pages.jobs_id.contribute.heading']} />
				</h2>
				<p class="leading-relaxed">
					<T
						message={m['pages.jobs_id.contribute.desc']}
						linkGithub={SOCIAL_LINKS.GITHUB}
						linkSponsor={p['/:lang/sponsor']({ lang: routing.lang })}
					/>
				</p>
			</section>

			<!-- Recruit -->
			<section class="space-y-6">
				<h2 class="border-outline c-text-heading border-b">
					<T message={m['pages.jobs_id.recruit.heading']} />
				</h2>
				<p class="leading-relaxed">
					<T message={m['pages.jobs_id.recruit.desc']} />
				</p>
				<div class="pt-2">
					<a class="c-btn c-btn--pop" href="{VITE_PUBLIC_RECRUIT_ORIGIN}/{routing.lang}" target="_blank">
						<T message={m['pages.jobs_id.recruit.cta']} />
					</a>
				</div>
			</section>
		</div>
	</div>
</main>
