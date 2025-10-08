<script lang="ts">
	import * as m from '$data/locales/generated/messages';
	import { PageJobPostingUpsert } from '$lib/forms/job-posting-upsert';

	import type { PageProps } from './$types';

	let { data }: PageProps = $props();
</script>

<PageJobPostingUpsert
	heading={m['pages.postings_upsert.heading.edit']}
	data={data.form}
	breadcrumbs={data.routing.breadcrumbs}
	action="?/edit"
	posting={data.posting}
	successMessage={m['pages.postings_upsert.notifications.update']}
/>
