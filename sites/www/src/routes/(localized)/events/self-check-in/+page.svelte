<script lang="ts">
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';
	import { ToBeAnnounced } from '$lib/components/ToBeAnnounced';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main>
	<div class="heading-container max-w-pad mt-6 space-y-10">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} scrollIndicator="ellipsis" />
		<h1 class="c-text-h1">{t.title}</h1>
	</div>
	<div class="pb[120px] max-w-pad mt-[120px] tb:pb-[200px]">
		<ToBeAnnounced>
			<p class="text-center leading-loose">{@html t.tba}</p>
		</ToBeAnnounced>
	</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.neutral.DEFAULT');
	}
</style>
