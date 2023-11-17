<script lang="ts">
	import { Breadcrumbs } from '$client/components/Breadcrumbs';

	import type { PageData } from './$types';

	export let data: PageData;

	$: t = data.translations.page;
</script>

<main class="tp-body1">
	<div class="heading-container c-container-design">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="tp-h2@sp font-medium uppercase tb:tp-h1@pc">{t.title}</h1>
	</div>
	<div class="c-container-design pb-40 pt-20">CONTENT</div>
</main>

<style lang="postcss">
	.heading-container {
		margin-top: calc(-1 * theme('spacing.header'));
		padding-top: calc(theme('spacing.header') + 20px);
		padding-bottom: 80px;
		background: theme('colors.design.bg.2');
	}
</style>
