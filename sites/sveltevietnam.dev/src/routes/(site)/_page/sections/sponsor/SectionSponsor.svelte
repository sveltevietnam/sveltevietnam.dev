<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import { TBA } from '$lib/components/tba';
	import { RoutingContext } from '$lib/routing/context.svelte';
	let { locale }: { locale: import('./locales/generated').Locale } = $props();

	const routing = RoutingContext.get();
</script>

<section class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10">
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg"><T message={locale.heading} /></h2>
		<p class="mx-auto max-w-[70ch]"><T message={locale.description} /></p>
	</div>
	<TBA class="text-center mx-auto w-fit">
		<p><T message={locale.list} /></p>
		<p>
			<a class="c-link" href="{routing.path('sponsor')}">
				<T message={locale.read_more} />
			</a>
		</p>
	</TBA>
</section>
