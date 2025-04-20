<script lang="ts">
	import { T } from '@sveltevietnam/i18n';

	import * as m from '$data/locales/generated/messages';
	import * as p from '$data/routes/generated';
	import { TBA } from '$lib/components/tba';
	import { SettingsContext } from '$lib/settings/context.svelte';

	const settings = SettingsContext.get();
</script>

<section class="max-w-pad pt-section pb-section-more bg-gradient-primary space-y-10">
	<div class="space-y-6 text-center">
		<h2 class="c-text-heading-lg"><T message={m['pages.home.sponsor.heading']} /></h2>
		<p class="max-w-readable mx-auto"><T message={m['pages.home.sponsor.desc']} /></p>
	</div>
	<TBA class="mx-auto w-fit text-center">
		<p><T message={m['pages.home.sponsor.list']} /></p>
		<p>
			<a class="c-link" href={p['/:lang/sponsor']({ lang: settings.language })}>
				<T message={m['pages.home.sponsor.read_more']} />
			</a>
		</p>
	</TBA>
</section>
