<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { Breadcrumbs } from '$lib/components/breadcrumbs';

	let { children, data } = $props();

	let locales = $derived(data.locales.page);
</script>

<main>
	<!-- intro -->
	<section
		class="space-y-section pt-intro-pad-top from-32% from-primary-surface to-surface bg-gradient-to-b"
	>
		<div class="max-w-pad space-y-10">
			<Breadcrumbs crumbs={data.routing.breadcrumbs} />
			<div class="space-y-4">
				{#if locales?.page_heading}
					<h1 class="c-text-heading-page text-primary-on-surface">
						<T message={locales.page_heading} />
					</h1>
				{/if}
				{#if locales?.page_description}
					<p class="c-text-subtitle-page"><T message={locales.page_description} /></p>
				{/if}
			</div>
		</div>
		<div class="flex items-center gap-3">
			<div class="bg-primary h-10 w-10"></div>
			<div class="bg-primary h-10 flex-1"></div>
			<svg
				class="h-10 w-14"
				width="56"
				height="40"
				viewBox="0 0 56 40"
				fill="none"
				xmlns="http://www.w3.org/2000/svg"
			>
				<path d="M56 20L0 40L2.82652e-06 0L56 20Z" fill="var(--color-primary)" />
			</svg>
		</div>
	</section>
	{@render children()}
</main>
