<script lang="ts">
	import { PageJobPostingUpsert } from '$lib/forms/job-posting-upsert';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageJobPostingUpsert
	headingTKey="pages.postings_upsert.heading.create"
	data={data.form}
	breadcrumbs={data.routing.breadcrumbs}
	action="?/create"
	posting={{
		id: 'preview',
		postedAt: new Date(),
		employer: data.employer,
		// these fields are from the form
		title: '<job_title>',
		type: '<job_type>',
		expiredAt: new Date(),
		location: '<job_location>',
		salary: '<job_salary>',
	}}
	successTKey="pages.postings_upsert.notifications.create"
/>
