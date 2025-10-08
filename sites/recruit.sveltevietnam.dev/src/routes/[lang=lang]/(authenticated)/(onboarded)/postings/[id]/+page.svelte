<script lang="ts">
	import { T } from '@sveltevietnam/i18n/runtime';
	import fallback1x1 from '@sveltevietnam/kit/assets/images/fallbacks/1x1.jpg?enhanced&w=w=224;112&imagetools';
	import { Breadcrumbs, CopyBtn } from '@sveltevietnam/kit/components';
	import { Contexts } from '@sveltevietnam/kit/contexts';
	import { DialogConfirmation, DialogQrCode } from '@sveltevietnam/kit/dialogs';
	import { formatDate } from '@sveltevietnam/kit/utilities/datetime';
	import sanitizeHtml from 'sanitize-html';
	import { superForm } from 'sveltekit-superforms';

	import { page } from '$app/state';
	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';
	import { SponsorReminder } from '$lib/components/sponsor-reminder';
	import { JOB_POSTING_TYPE_LABEL } from '$lib/forms/job-posting-upsert';
	import { createSuperFormGenericErrorHandler } from '$lib/forms/utils';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const {
		routing,
		dialogs,
		colorScheme,
		notifications: { toaster },
	} = Contexts.get();

	let url = $derived(page.url.origin + routing.paths[routing.lang]);
	const typeLabelMessage = $derived(JOB_POSTING_TYPE_LABEL[data.posting.type]);
	const applicationLink = $derived(
		data.posting.applicationMethod === 'email'
			? `mailto:${data.posting.applicationLink}`
			: data.posting.applicationLink,
	);

	const { delayed, timeout, enhance } = superForm(data.deleteForm, {
		resetForm: false,
		invalidateAll: false,
		multipleSubmits: 'prevent',
		delayMs: 500,
		timeoutMs: 2000,
		onError: createSuperFormGenericErrorHandler(toaster),
		onResult({ result }) {
			if (result.type === 'success') {
				toaster.success({
					message: m['pages.postings_id.delete.success'],
				});
			}
		},
	});

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

	let deleteForm: HTMLFormElement;
	async function confirmDelete(e: Event) {
		e.preventDefault();
		const pushed = dialogs.push('custom', {
			component: DialogConfirmation,
			props: {
				title: m['pages.postings_id.delete.confirmation.title'],
				description: m['pages.postings_id.delete.confirmation.desc'],
				cancel: m['pages.postings_id.delete.confirmation.cancel'],
				confirm: {
					content: m['pages.postings_id.delete.confirmation.confirm'],
					attributes: {
						class:
							'c-btn c-btn--outlined bg-error-on-surface border-error-on-surface text-error-surface',
					},
				},
			},
		});
		const result = await pushed.resolution;
		if (result === 'confirm') {
			deleteForm.requestSubmit();
		}
	}

	const statusToColorClass = {
		active: 'text-success-on-surface',
		pending: 'text-warning-on-surface',
		expired: 'text-error-on-surface',
		deleted: 'text-error-on-surface',
	};
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

			{#if data.posting.status === 'pending'}
				<p class="c-callout c-callout--warning" role="note">
					<T message={m['pages.postings_id.pending']} />
				</p>
			{/if}

			<div class="border-outline border p-4">
				<h2 class="sr-only">
					<T message={m['pages.postings_id.general.heading']} />
				</h2>

				<!-- general information -->
				<section
					class="tablet:flex-row flex flex-col-reverse items-start justify-between gap-4 space-y-6"
				>
					<dl class="grid grid-cols-[auto_1fr] gap-4">
						<!-- status -->
						<dt>
							<i class={['i i-[ph--pulse] h-6 w-6', statusToColorClass[data.posting.status]]}></i>
							<span class="sr-only">
								<T message={m['pages.postings_id.general.status.name']} />
							</span>
						</dt>
						<dd class={statusToColorClass[data.posting.status]} data-testid="status-name">
							{#if data.posting.status === 'deleted'}
								<T message={m['pages.postings_id.general.status.deleted']} />
							{:else if data.posting.status === 'expired'}
								<T message={m['pages.postings_id.general.status.expired']} />
							{:else if data.posting.status === 'pending'}
								<T message={m['pages.postings_id.general.status.pending']} />
							{:else}
								<T
									message={m['pages.postings_id.general.status.active']}
									mainSiteUrl={VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}
								/>
							{/if}
						</dd>

						<!-- employer -->
						<dt>
							<i class="i i-[ph--buildings] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['inputs.employer.name.label']} />
							</span>
						</dt>
						<dd class="font-medium" data-testid="employer-name">
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
								<T message={m['inputs.job_posting.type.label']} />
							</span>
						</dt>
						<dd data-testid="job-type">
							{typeLabelMessage(routing.lang)}
						</dd>

						<!-- location -->
						<dt>
							<i class="i i-[ph--map-pin] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['inputs.job_posting.location.label']} />
							</span>
						</dt>
						<dd data-testid="job-location">
							{data.posting.location}
						</dd>

						<!-- salary -->
						<dt>
							<i class="i i-[ph--money] h-6 w-6"></i>
							<span class="sr-only">
								<T message={m['inputs.job_posting.salary.label']} />
							</span>
						</dt>
						<dd data-testid="job-salary">
							{data.posting.salary}
						</dd>

						{#if data.posting.postedAt}
							<!-- publication date -->
							<dt>
								<i class="i i-[ph--calendar-blank] h-6 w-6"></i>
							</dt>
							<dd data-testid="job-posted-at">
								<T message={m['pages.postings_id.general.posted_at']} />
								{formatDate(data.posting.postedAt)}
							</dd>
						{/if}

						<!-- expiration date -->
						<dt>
							<i class="i i-[ph--calendar-x] h-6 w-6"></i>
						</dt>
						<dd data-testid="job-expired-at">
							<T message={m['pages.postings_id.general.expired_at']} />
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
									data-testid="employer-image"
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
					>
						<T message={m['pages.postings_id.actions.apply']} />
					</a>

					<!-- copy link -->
					<CopyBtn
						class="c-btn c-btn--outlined shrink-0 grid-cols-1 p-2"
						aria={m['pages.postings_id.actions.share.link']}
						textToCopy={url}
					/>

					<!-- generate QR -->
					<button
						class="c-btn c-btn--outlined shrink-0 grid-cols-1 p-2"
						type="button"
						onclick={openQrDialog}
					>
						<span class="sr-only"><T message={m['pages.postings_id.actions.share.qr']} /></span>
						<i class="i i-[ph--qr-code] h-6 w-6"></i>
					</button>
				</section>
			</div>

			<div class="space-y-section pt-10">
				<!-- job description -->
				<section class="space-y-6">
					<h2 class="c-text-heading border-b">
						<T message={m['pages.postings_id.job_desc.heading']} />
					</h2>
					<div class="prose max-w-full" data-testid="job-description">
						<!-- eslint-disable-next-line svelte/no-at-html-tags -->
						{@html sanitizeHtml(data.posting.description, { allowedClasses: { p: [/callout/] } })}
					</div>
				</section>

				<!-- employer description -->
				{#if data.user && data.user.description}
					<section class="space-y-6">
						<h2 class="c-text-heading border-b">
							<T
								message={m['pages.postings_id.employer_desc.heading']}
								employerName={data.user.name}
							/>
						</h2>
						<div class="prose max-w-full" data-testid="employer-description">
							<!-- eslint-disable-next-line svelte/no-at-html-tags -->
							{@html sanitizeHtml(data.user.description, { allowedClasses: { p: [/callout/] } })}
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
			<section class="space-y-6">
				<h2 class="border-outline c-text-heading border-b">
					<T message={m['pages.postings_id.manage.heading']} />
				</h2>

				<div class="flex gap-4">
					<form class="contents" action="?/delete" method="POST" use:enhance bind:this={deleteForm}>
						<input name="id" value={data.posting.id} required hidden />
						<button
							class="c-btn bg-error-on-surface text-error-surface border-error-on-surface flex-1 place-content-center
							px-6"
							type="submit"
							data-delayed={$delayed}
							data-timeout={$timeout}
							onclick={confirmDelete}
						>
							<i class="i i-[ph--trash] h-6 w-6"></i>
							<span><T message={m['pages.postings_id.manage.delete']} /></span>
						</button>
					</form>
					{#if data.editable}
						<a
							class="c-btn flex-1 place-content-center"
							href={p['/:lang/postings/:id/edit']({ lang: routing.lang, id: data.posting.id })}
						>
							<i class="i i-[ph--pencil] h-6 w-6"></i>
							<T message={m['pages.postings_id.manage.edit']} />
						</a>
					{/if}
				</div>
			</section>

			<SponsorReminder />
		</div>
	</div>
</main>
