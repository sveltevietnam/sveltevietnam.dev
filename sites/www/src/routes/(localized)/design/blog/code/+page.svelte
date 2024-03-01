<script lang="ts">
	import { Breadcrumbs } from '$lib/components/Breadcrumbs';

	import type { PageData } from './$types';
	import Content from './_page/content.md.svelte?mdsvex';

	export let data: PageData;
</script>

<main>
	<div class="heading-container max-w-pad">
		<Breadcrumbs breadcrumbs={data.breadcrumbs} class="mb-10" />
		<h1 class="c-text-h1 font-medium">Enhanced Code Block</h1>
	</div>

	<div class="max-w-pad space-y-20 pb-48 pt-20">
		<div class="prose max-w-full dark:prose-invert">
			<Content />
		</div>
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
