<script lang="ts" module>
	import { JOB_POSTING_TYPE_I18N } from '@sveltevietnam/backend/data/job-postings/enums';
	import { T } from '@sveltevietnam/i18n';
	import type { KeySimple } from '@sveltevietnam/i18n/generated';
	import {
		Breadcrumbs,
		type BreadcrumbsProps,
		type JobPostingProps,
		JobPosting,
	} from '@sveltevietnam/kit/components';
	import { EMAILS } from '@sveltevietnam/kit/constants';
	import { Contexts } from '@sveltevietnam/kit/contexts';

	import { VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';
	import { SponsorReminder } from '$lib/components/sponsor-reminder';
	import {
		FormJobPostingUpsert,
		type FormJobPostingUpsertProps,
		type JobPostingType,
	} from '$lib/forms/job-posting-upsert';

	export interface JobPostingUpsertLayoutProps {
		breadcrumbs: BreadcrumbsProps['crumbs'];
		headingTKey: KeySimple;
		action: string;
		posting: Omit<JobPostingProps['posting'], 'href'>;
		data: FormJobPostingUpsertProps['data'];
		successTKey: KeySimple;
	}
</script>

<script lang="ts">
	let {
		breadcrumbs,
		action,
		posting,
		data,
		headingTKey,
		successTKey,
	}: JobPostingUpsertLayoutProps = $props();

	const { routing } = Contexts.get();

	let previewPosting: Omit<JobPostingProps['posting'], 'href'> = $state(posting);

	function handleChangeForm(event: Event) {
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		const expiredAt = formData.get('expiredAt')?.toString();
		previewPosting = {
			...previewPosting,
			title: formData.get('title')?.toString() || previewPosting.title,
			type:
				JOB_POSTING_TYPE_I18N[formData.get('type') as JobPostingType]?.[routing.lang] ||
				previewPosting.type,
			location: formData.get('location')?.toString() || previewPosting.location,
			salary: formData.get('salary')?.toString() || previewPosting.salary,
			expiredAt: expiredAt ? new Date(expiredAt) : previewPosting.expiredAt,
		};
	}
</script>

<main
	class="max-w-pad mt-header pt-section pb-section-more tablet:space-y-8 desktop:space-y-10 flex-1 space-y-6"
>
	<Breadcrumbs crumbs={breadcrumbs} />

	<div class="desktop:flex-row gap-section desktop:gap-20 flex flex-col">
		<!-- form -->
		<div class="flex-1 space-y-6">
			<h1 class="c-text-heading border-outline border-b">
				<T key={headingTKey} />
			</h1>
			<FormJobPostingUpsert {data} {action} onchange={handleChangeForm} {successTKey}>
				{#snippet cta({ delayed, timeout })}
					<button
						class="c-btn c-btn--pop"
						type="submit"
						data-delayed={delayed}
						data-timeout={timeout}
						data-umami-event="submit-upsert-job-posting"
					>
						<span><T key="pages.postings_upsert.form.cta" /></span>
					</button>
				{/snippet}
			</FormJobPostingUpsert>
		</div>

		<div
			class="desktop:self-start desktop:sticky desktop:top-header desktop:max-w-96 h-fit space-y-10"
		>
			<!-- Preview -->
			<section class="space-y-6">
				<h2 class="c-text-heading border-outline border-b">
					<T key="pages.postings_upsert.preview.heading" />
				</h2>
				<p class="leading-relaxed">
					<T
						key="pages.postings_upsert.preview.desc"
						params={{ mainSiteUrl: VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN }}
					/>:
				</p>
				<JobPosting posting={previewPosting} />
				<p class="c-callout c-callout--info c-callout--icon-bulb leading-relaxed">
					<T key="pages.postings_upsert.preview.callout" />
				</p>
			</section>

			<!-- Sponsor -->
			<SponsorReminder />

			<!-- Support -->
			<section class="space-y-6">
				<h2 class="c-text-heading border-outline border-b">
					<T key="pages.postings_upsert.support.heading" />
				</h2>
				<p class="leading-relaxed">
					<T key="pages.postings_upsert.support.desc" params={{ mail: EMAILS.JOBS }} />
				</p>
			</section>
		</div>
	</div>
</main>
