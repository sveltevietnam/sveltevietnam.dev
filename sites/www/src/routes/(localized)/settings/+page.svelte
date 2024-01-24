<script lang="ts">
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { Settings } from '$lib/components/Settings';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main class="max-w-pad pb-[60px] tb:pb-[200px]">
	<div class="mt-6">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} />
	</div>

	<section class="mt-8 space-y-6">
		<h1 class="c-text-h1 font-medium uppercase">{t.title}</h1>
		<p class="c-text-h4 mt-6 tb:mt-8">{t.subtitle}</p>
	</section>

	<Settings class="mt-[60px] tb:mt-[120px]"></Settings>
</main>
