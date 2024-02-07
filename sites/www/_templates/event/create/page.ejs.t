---
to: <%= baseDir %>/+page.svelte
unless_exists: true
---
<script lang="ts">
	import { intersect } from '$lib/actions/intersect';
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
	$: event = data.event;
</script>

<main class="relative overflow-hidden">
	<div class="max-w-pad" use:intersect>
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mt-6" />
	</div>
	<div class="max-w-pad mt-[80px]" use:intersect>
		<h1 class="c-text-h1">{event.title}</h1>
	</div>
	<div class="space-y-[60px] pb-[120px] tb:space-y-[120px] tb:pb-[200px]">
		content
	</div>
</main>
