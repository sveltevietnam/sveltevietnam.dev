<script lang="ts">
	import { T } from '@sveltevietnam/i18n';
	import type { Message } from '@sveltevietnam/i18n/runtime';
	import { Breadcrumbs, type JobPostingProps, JobPosting } from '@sveltevietnam/kit/components';
	import { RoutingContext } from '@sveltevietnam/kit/contexts';

	import * as m from '$data/locales/generated/messages';
	import { VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN } from '$env/static/public';
	import type { JobPostingType } from '$lib/forms/job-posting-upsert';
	import JobPostingUpsert from '$lib/forms/job-posting-upsert/JobPostingUpsert.svelte';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();

	const routing = RoutingContext.get();

	let previewPosting: Omit<JobPostingProps['posting'], 'href'> = $state({
		id: 'preview',
		postedAt: new Date(),
		// TODO: get this from user profile
		employer: data.employer,
		// these fields are from the form
		title: '<job_title>',
		type: '<job_type>',
		expiredAt: new Date(),
		location: '<job_location>',
		salary: '<job_salary>',
	});

	const JOB_TYPE_MESSAGE: Record<JobPostingType, Message<'string', never>> = {
		'full-time': m['inputs.job_posting.type.options.full_time'],
		'part-time': m['inputs.job_posting.type.options.part_time'],
		internship: m['inputs.job_posting.type.options.internship'],
		contract: m['inputs.job_posting.type.options.contract'],
		volunteer: m['inputs.job_posting.type.options.volunteer'],
	};

	function handleChangeForm(event: Event) {
		console.log(event.target, event.currentTarget);
		const formData = new FormData(event.currentTarget as HTMLFormElement);
		previewPosting = {
			...previewPosting,
			title: formData.get('title')?.toString() || previewPosting.title,
			type:
				JOB_TYPE_MESSAGE[formData.get('type') as JobPostingType]?.(routing.lang).toString() ||
				previewPosting.type,
			location: formData.get('location')?.toString() || previewPosting.location,
			salary: formData.get('salary')?.toString() || previewPosting.salary,
			expiredAt: formData.get('expiredAt')
				? new Date(formData.get('expiredAt')?.toString() || '')
				: previewPosting.expiredAt,
		};
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
		<!-- form -->
		<div class="flex-1 space-y-6">
			<h1 class="c-text-heading border-outline border-b">
				<T message={m['pages.postings_create.heading']} />
			</h1>
			<JobPostingUpsert data={data.form} action="?/create" onchange={handleChangeForm}>
				{#snippet cta({ delayed, timeout })}
					<button
						class="c-btn c-btn--pop"
						type="submit"
						data-delayed={delayed}
						data-timeout={timeout}
					>
						<T message={m['pages.postings_create.form.cta']} />
					</button>
				{/snippet}
			</JobPostingUpsert>
		</div>

		<div
			class="space-y-10 desktop:self-start desktop:sticky desktop:top-header h-fit max-w-96"
		>
			<!-- Preview -->
			<section class="space-y-6">
				<h2 class="c-text-heading border-outline border-b">
					<T message={m['pages.postings_create.preview.heading']} />
				</h2>
				<p class="leading-relaxed">
					<T
						message={m['pages.postings_create.preview.desc']}
						mainSiteUrl={VITE_PUBLIC_SVELTE_VIETNAM_ORIGIN}
					/>:
				</p>
				<JobPosting
					posting={previewPosting}
					i18n={{
						at: m['at'],
						postedAt: m['components.job_posting_list.posted_at'],
						expiredAt: m['components.job_posting_list.expired_at'],
					}}
				/>
				<p class="c-callout c-callout--info c-callout--icon-bulb leading-relaxed">
					<T message={m['pages.postings_create.preview.callout']} />
				</p>
			</section>

			<!-- Sponsor -->
			<section class="space-y-6">
				<div class=" border-outline border-b flex items-end justify-between">
					<h2 class="c-text-heading">
						<T message={m['pages.postings_create.sponsor.heading']} />
					</h2>
					<a
						class="c-btn inline-block float-end"
						href="https://opencollective.com/sveltevietnam"
					>
						<T message={m['pages.postings_create.sponsor.cta']} />
					</a>
				</div>
				<p class="leading-relaxed">
					<T message={m['pages.postings_create.sponsor.desc']} />
				</p>
				<p class="c-callout c-callout--info c-callout--icon-bulb leading-relaxed">
					<T message={m['pages.postings_create.sponsor.callout']} />
				</p>
			</section>

			<!-- Support -->
			<section class="space-y-6">
				<h2 class="c-text-heading border-outline border-b">
					<T message={m['pages.postings_create.support.heading']} />
				</h2>
				<p class="leading-relaxed">
					<T message={m['pages.postings_create.support.desc']} />
				</p>
			</section>
		</div>
	</div>
</main>
