<script lang="ts">
	import * as m from '$data/locales/generated/messages';
	import { PageJobPostingUpsert } from '$lib/forms/job-posting-upsert';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageJobPostingUpsert
	heading={m['pages.postings_upsert.heading.create']}
	data={data.form}
	breadcrumbs={data.routing.breadcrumbs}
	action="?/create"
	posting={{
		id: 'preview',
		createdAt: new Date(),
		employer: data.employer,
		// these fields are from the form
		title: '<job_title>',
		type: '<job_type>',
		expiredAt: new Date(),
		location: '<job_location>',
		salary: '<job_salary>',
	}}
/>
