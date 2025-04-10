<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import { TBA } from '$lib/components/tba';
	import { RoutingContext } from '$lib/routing/context.svelte';

	const routing = RoutingContext.get();
</script>

<section class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10">
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg"><T message={m['pages.home.sponsor.heading']} /></h2>
		<p class="mx-auto max-w-readable"><T message={m['pages.home.sponsor.desc']} /></p>
	</div>
	<TBA class="text-center mx-auto w-fit">
		<p><T message={m['pages.home.sponsor.list']} /></p>
		<p>
			<a class="c-link" href="{routing.path('sponsor')}">
				<T message={m['pages.home.sponsor.read_more']} />
			</a>
		</p>
	</TBA>
</section>
