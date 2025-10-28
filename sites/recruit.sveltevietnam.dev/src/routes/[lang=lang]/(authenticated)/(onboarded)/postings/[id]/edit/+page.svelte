<script lang="ts">
	import { PageJobPostingUpsert } from '$lib/forms/job-posting-upsert';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageJobPostingUpsert
	headingTKey="pages.postings_upsert.heading.edit"
	data={data.form}
	breadcrumbs={data.routing.breadcrumbs}
	action="?/edit"
	posting={data.posting}
	successTKey="pages.postings_upsert.notifications.update"
/>
